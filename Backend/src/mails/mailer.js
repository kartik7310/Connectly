import logger from "../config/logger.js";
import config from "../config/env.js";

/**
 * Validates and formats recipient email(s) into Brevo API format: [{ email: "...", name: "..." }]
 */
function formatRecipients(to) {
  if (!to) return [];

  const recipientList = Array.isArray(to) ? to : (typeof to === "string" ? to.split(",") : [to]);
  const formatted = [];

  for (const item of recipientList) {
    if (typeof item === "string") {
      const trimmed = item.trim();
      if (!trimmed) continue;

      // Extract Name <email> format if present
      const match = trimmed.match(/^(?:(.*?)<)?([^>]+)>?$/);
      if (match) {
        const name = match[1] ? match[1].trim().replace(/^["']|["']$/g, "") : undefined;
        const email = match[2].trim();
        if (isValidEmail(email)) {
          formatted.push(name ? { email, name } : { email });
        }
      }
    } else if (item && typeof item === "object") {
      if (item.email && isValidEmail(item.email)) {
        formatted.push(item.name ? { email: item.email, name: item.name } : { email: item.email });
      }
    }
  }

  return formatted;
}

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function sendMail({ to, subject, html, text }) {
  try {
    const apiKey = config.brevo?.apiKey || process.env.BREVO_API_KEY;
    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      const errorMsg = "Invalid API key: BREVO_API_KEY is missing or invalid in environment configuration.";
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const senderEmail = config.brevo?.senderEmail || process.env.BREVO_SENDER_EMAIL;
    const senderName = config.brevo?.senderName || process.env.BREVO_SENDER_NAME || "Connexeto";

    if (!senderEmail || !isValidEmail(senderEmail)) {
      const errorMsg = `Invalid sender email configuration: '${senderEmail}'. Please configure BREVO_SENDER_EMAIL.`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const recipients = formatRecipients(to);
    if (!recipients || recipients.length === 0) {
      const errorMsg = `Invalid recipient: No valid email address found in '${typeof to === "object" ? JSON.stringify(to) : to}'`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const payload = {
      sender: {
        email: senderEmail,
        name: senderName,
      },
      to: recipients,
      subject: subject || "No Subject",
    };

    if (html) payload.htmlContent = html;
    if (text) payload.textContent = text;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response;
    try {
      response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": apiKey.trim(),
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (networkError) {
      clearTimeout(timeoutId);
      const isTimeout = networkError.name === "AbortError";
      const errorMsg = isTimeout
        ? `Network failure: Request to Brevo API timed out after 15s when sending email to ${JSON.stringify(to)}`
        : `Network failure: Unable to connect to Brevo API when sending email to ${JSON.stringify(to)} (${networkError.message})`;
      logger.error(errorMsg);
      throw new Error(errorMsg);
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch (e) {
        const textBody = await response.text().catch(() => "");
        errorData = { message: textBody || response.statusText };
      }

      const brevoMessage = errorData.message || errorData.code || response.statusText || "Unknown Brevo API error";
      let errorMsg;

      if (response.status === 401 || response.status === 403) {
        errorMsg = `Invalid API key: Brevo API authentication failed (${response.status} - ${brevoMessage})`;
      } else if (response.status === 429) {
        errorMsg = `Rate limiting: Brevo API rate limit exceeded when sending email to ${JSON.stringify(to)} (${brevoMessage})`;
      } else if (response.status === 400 && /recipient|email|to|invalid/i.test(brevoMessage)) {
        errorMsg = `Invalid recipient: Brevo API rejected email to ${JSON.stringify(to)} (${brevoMessage})`;
      } else {
        errorMsg = `Brevo API error (${response.status}): Failed to send email to ${JSON.stringify(to)} - ${brevoMessage}`;
      }

      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    const data = await response.json().catch(() => ({}));
    const messageId = data.messageId || `brevo-${Date.now()}`;
    logger.info(`Email sent successfully to ${JSON.stringify(to)}: ${messageId}`);

    return { messageId, ...data };
  } catch (error) {
    if (!error.message?.startsWith("Invalid API key:") &&
        !error.message?.startsWith("Invalid sender") &&
        !error.message?.startsWith("Invalid recipient:") &&
        !error.message?.startsWith("Network failure:") &&
        !error.message?.startsWith("Rate limiting:") &&
        !error.message?.startsWith("Brevo API error")) {
      logger.error(`Unexpected error sending email to ${JSON.stringify(to)}: ${error.message || error}`);
    }
    throw error;
  }
}

export default sendMail;