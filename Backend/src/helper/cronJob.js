
import cron from 'node-cron';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import ConnectionRequest from '../models/connectionRequest.js';
import User from '../models/user.js';
import { notificationEmail } from '../mails/notificationEmail.js';
import logger from '../config/logger.js';

// This cron job will run at midnight (00:00) every day to expire outdated memberships
cron.schedule('0 0 * * *', async () => {
  logger.info("Membership expiration cron job started:", new Date().toISOString());

  try {
    const now = new Date();
    const expiredUsers = await User.find({
      plan: "PREMIUM",
      $or: [
        { subscriptionEndDate: { $exists: false } },
        { subscriptionEndDate: null },
        { subscriptionEndDate: { $lte: now } }
      ]
    });

    if (!expiredUsers || expiredUsers.length === 0) {
      logger.info("No expired memberships found.");
      return;
    }

    const expiredIds = expiredUsers.map(u => u._id);
    const result = await User.updateMany(
      { _id: { $in: expiredIds } },
      {
        $set: {
          plan: "FREE",
          subscriptionStatus: "expired"
        },
        $unset: {
          subscriptionStartDate: "",
          subscriptionEndDate: ""
        }
      }
    );

    logger.info(`Successfully expired ${result.modifiedCount || expiredUsers.length} memberships.`);
  } catch (error) {
    logger.error("Membership expiration cron job error:", error.message || error);
  }
});

// This cron job will run at 9:00 AM every day
cron.schedule('0 9 * * *', async () => { 

  logger.info("Cron job started:", new Date().toISOString());
  
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingConnections = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd
      }
    }).populate('toUserId fromUserId');

    if (pendingConnections.length === 0) {
      logger.info("No pending connections found");
      return;
    }

    // Group connections by recipient email universally for all users (free and paid)
    const emailToConnections = {};
    
    pendingConnections.forEach(conn => {
      const recipientEmail = conn.toUserId.email;
      
      if (!emailToConnections[recipientEmail]) {
        emailToConnections[recipientEmail] = [];
      }
      
      emailToConnections[recipientEmail].push({
        firstName: conn.fromUserId.firstName,
        lastName: conn.fromUserId.lastName,
        fullName: `${conn.fromUserId.firstName} ${conn.fromUserId.lastName}`,
        email: conn.fromUserId.email,
        photoUrl: conn.fromUserId.photoUrl
      });
    });

    const recipientEmails = Object.keys(emailToConnections);
    if (recipientEmails.length === 0) {
      logger.info("No recipients found for pending connection emails.");
      return;
    }

    const emailPromises = Object.entries(emailToConnections).map(([email, senders]) =>
      notificationEmail(email, senders)
        .catch(error => logger.error(`Failed to send email to ${email}:`, error.message))
    );

    await Promise.allSettled(emailPromises);
    
    logger.info(`Sent emails to ${recipientEmails.length} users`);

  } catch (error) {
    logger.error("Cron job error:", error.message);
  }
});