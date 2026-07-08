import mailGenerator from "../config/mailgen.js";
import sendMail from "./mailer.js";
import config from "../config/env.js";

/**
 * Sends a premium blog notification email to an accepted connection.
 * 
 * @param {Object} recipient - The recipient user object ({ email, firstName, lastName })
 * @param {Object} author - The blog author user object ({ firstName, lastName, photoUrl })
 * @param {Object} blog - The blog object ({ _id, title, content })
 */
export async function sendBlogNotificationEmail(recipient, author, blog) {
  const authorName = `${author.firstName || ""} ${author.lastName || ""}`.trim() || "A connection";
  
  // Format author avatar using table cells for reliable email client rendering
  const authorPhotoHtml = author.photoUrl 
    ? `<img src="${author.photoUrl}" alt="${authorName}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; vertical-align: middle;">`
    : `<div style="width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: inline-flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; vertical-align: middle;">
        ${(author.firstName || "C").charAt(0).toUpperCase()}${(author.lastName || "").charAt(0).toUpperCase()}
      </div>`;

  // Strip markdown/HTML tags and format excerpt
  const plainContent = (blog.content || "").replace(/<[^>]*>?/gm, "").replace(/[#*`_~]/g, "").trim();
  const excerpt = plainContent.length > 180 ? `${plainContent.substring(0, 180)}...` : plainContent;

  const clientUrl = config.corsOrigin.split(',')[0].trim();
  const blogLink = `${clientUrl}/blogs/${blog._id}`;

  const blogCardHtml = `
    <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0; background-color: #f8fafc;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;" role="presentation">
        <tr>
          <td style="width: 60px; vertical-align: middle;">
            ${authorPhotoHtml}
          </td>
          <td style="vertical-align: middle;">
            <strong style="font-size: 16px; color: #1e293b; display: block;">${authorName}</strong>
            <span style="font-size: 12px; color: #64748b;">Published a new article</span>
          </td>
        </tr>
      </table>
      <h3 style="margin: 0 0 10px 0; font-size: 18px; color: #0f172a;">${blog.title}</h3>
      <p style="margin: 0; font-size: 14px; color: #475569; line-height: 1.6;">${excerpt}</p>
    </div>
  `;

  const email = {
    body: {
      name: recipient.firstName || "Member",
      intro: [
        `Great news! Your professional connection **${authorName}** just published a new blog post on Connexto.`,
        blogCardHtml
      ],
      action: {
        instructions: "Click below to read the full blog post and join the discussion:",
        button: {
          color: "#22BC66",
          text: "Read Blog",
          link: blogLink
        }
      },
      outro: "As a valued Connexto Premium member, you get instant notifications so you never miss valuable insights from your professional network."
    }
  };

  const html = mailGenerator.generate(email);
  const text = mailGenerator.generatePlaintext(email);

  return sendMail({
    to: recipient.email,
    subject: "Your connection just published a new blog",
    html,
    text
  });
}
