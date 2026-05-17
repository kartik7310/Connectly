import ConnectionRequest from "../models/connectionRequest.js";
import Blog from "../models/blog.js";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";

import logger from "../config/logger.js";

const LIMITS = {
  connection: 5,
  blog: 3,
  aichat: 0
};

export const checkUsageLimit = async (userId, type) => {
  const user = await User.findById(userId).select("plan");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // PREMIUM users have no limits
  if (user.plan === "PREMIUM") {
    return false;
  }

  // FREE users are subject to limits
  const limit = LIMITS[type];
  if (limit === undefined) {
    return false;
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let count = 0;

  switch (type) {
    case "connection":
      count = await ConnectionRequest.countDocuments({
        fromUserId: userId,
        createdAt: { $gte: startOfDay }
      });
      break;

    case "blog":
      count = await Blog.countDocuments({
        author: userId,
        createdAt: { $gte: startOfDay }
      });
      break;
  }

  return count >= limit;
};

export const checkLimit = (type) => async (req, res, next) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return next(new AppError("Unauthorized", 401));
    }

    const isLimitExceeded = await checkUsageLimit(userId, type);

    if (isLimitExceeded) {
      return res.status(403).json({
        success: false,
        message: "Daily limit reached. Upgrade to Premium to continue."
      });
    }

    next();
  } catch (error) {
    logger.error(`Error in checkLimit middleware: ${error.message}`);
    next(error);
  }
};
