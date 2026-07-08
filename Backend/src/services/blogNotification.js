import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import logger from "../config/logger.js";
import { sendBlogNotificationEmail } from "../mails/blogNotification.js";
import { getPremiumUserQuery } from "../utils/membership.js";

const BlogNotificationService = {
  /**
   * Asynchronously notifies all accepted connections of the author who have an active Premium Membership.
   * Designed to be called non-blocking after blog publication.
   * 
   * @param {Object} blog - The newly created blog document
   * @param {string|Object} authorId - The ID of the blog author
   */
  async notifyPremiumConnections(blog, authorId) {
    try {
      const authorIdStr = String(authorId);
      logger.info(`Starting background blog notification for blog: ${blog._id}, author: ${authorIdStr}`);

      // 1. Fetch author details needed for email personalization
      const author = await User.findById(authorId).select("firstName lastName photoUrl").lean();
      if (!author) {
        logger.warn(`notifyPremiumConnections: Author not found (${authorIdStr})`);
        return;
      }

      // 2. Find all accepted connections without N+1 queries
      const connectionRequests = await ConnectionRequest.find({
        status: "accepted",
        $or: [
          { fromUserId: authorId },
          { toUserId: authorId }
        ]
      }).select("fromUserId toUserId").lean();

      if (!connectionRequests || connectionRequests.length === 0) {
        logger.info(`No accepted connections found for author ${authorIdStr}. Skipping notifications.`);
        return;
      }

      // 3. Extract unique connected user IDs, ensuring no duplicates and excluding author
      const connectedUserIds = new Set();
      for (const req of connectionRequests) {
        const fromId = String(req.fromUserId);
        const toId = String(req.toUserId);
        if (fromId && fromId !== authorIdStr) connectedUserIds.add(fromId);
        if (toId && toId !== authorIdStr) connectedUserIds.add(toId);
      }

      if (connectedUserIds.size === 0) {
        logger.info(`No valid connection IDs extracted for author ${authorIdStr}. Skipping notifications.`);
        return;
      }

      // 4. Query only Premium members with active membership using Single Source of Truth
      const premiumRecipients = await User.find({
        _id: { $in: Array.from(connectedUserIds) },
        ...getPremiumUserQuery()
      }).select("email firstName lastName").lean();

      if (!premiumRecipients || premiumRecipients.length === 0) {
        logger.info(`None of the ${connectedUserIds.size} connections have an active Premium Membership. No emails sent.`);
        return;
      }

      logger.info(`Found ${premiumRecipients.length} active Premium connections to notify for blog ${blog._id}`);

      // 5. Send notifications concurrently using Promise.allSettled so one failure doesn't affect others
      const emailPromises = premiumRecipients.map((recipient) => {
        if (!recipient.email) return Promise.resolve({ status: "skipped", reason: "No email address" });
        return sendBlogNotificationEmail(recipient, author, blog);
      });

      const results = await Promise.allSettled(emailPromises);

      let successCount = 0;
      let failCount = 0;

      results.forEach((result, index) => {
        const recipientEmail = premiumRecipients[index]?.email;
        if (result.status === "fulfilled") {
          successCount++;
        } else {
          failCount++;
          logger.error(`Failed to send blog notification email to ${recipientEmail || "unknown"}:`, result.reason);
        }
      });

      logger.info(`Blog notification completed for blog ${blog._id}. Success: ${successCount}, Failed: ${failCount}`);
    } catch (error) {
      // Catch all top-level errors to ensure background processing never crashes the application
      logger.error(`Unexpected error in notifyPremiumConnections for blog ${blog?._id}:`, error);
    }
  }
};

export default BlogNotificationService;
