import User from "../models/user.js";
import logger from "../config/logger.js";


export const isUserPremium = (user) => {
  if (!user) return false;

  const isPremiumPlan = user.plan === "PREMIUM";
  const isActiveStatus = user.subscriptionStatus === "active";
  const hasValidExpiry = user.subscriptionEndDate && new Date(user.subscriptionEndDate) > new Date();

  return Boolean(isPremiumPlan && isActiveStatus && hasValidExpiry);
};

/**
 * Returns Mongoose query filter for matching active Premium members in database queries.
 *
 * @returns {Object} Mongoose query filter
 */
export const getPremiumUserQuery = () => {
  const now = new Date();
  return {
    plan: "PREMIUM",
    subscriptionStatus: "active",
    subscriptionEndDate: { $gt: now }
  };
};

/**
 * Checks if a user's Premium membership has expired.
 * If expired, updates the database record to FREE and expired status,
 * and mutates the in-memory user object so callers receive clean state immediately.
 *
 * @param {Object} user - User document or plain object
 * @returns {Promise<boolean>} True if user was expired and updated, false otherwise
 */
export const checkAndExpireUser = async (user) => {
  if (!user || !user._id) return false;

  // If user is marked as PREMIUM in DB or memory, check if their subscription has expired
  if (user.plan === "PREMIUM") {
    const now = new Date();
    const isExpired = !user.subscriptionEndDate || new Date(user.subscriptionEndDate) <= now;

    if (isExpired) {
      try {
        logger.info(`Lazy expiration triggered for user ${user._id} (${user.email || "unknown"}). Expiring Premium membership.`);
        await User.updateOne(
          { _id: user._id },
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

        // Update in-memory object so immediate return values reflect FREE status
        user.plan = "FREE";
        user.subscriptionStatus = "expired";
        user.subscriptionStartDate = undefined;
        user.subscriptionEndDate = undefined;
        if (user._doc) {
          user._doc.plan = "FREE";
          user._doc.subscriptionStatus = "expired";
          delete user._doc.subscriptionStartDate;
          delete user._doc.subscriptionEndDate;
        }

        return true;
      } catch (error) {
        logger.error(`Failed to expire user membership for ${user._id}:`, error);
        return false;
      }
    }
  }

  return false;
};
