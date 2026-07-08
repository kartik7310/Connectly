import jwt from "jsonwebtoken";
import User from "../models/user.js";
import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";
import { config } from "../config/env.js";
import { checkAndExpireUser, isUserPremium } from "../utils/membership.js";


export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new AppError("Not authorized, token missing", 401));
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    if(!decoded){
      logger.info("Invalid or expired token")
      return next(new AppError("Invalid or expired token", 401));
    }
    req.user = await User.findById(decoded.id).select("-password");
    await checkAndExpireUser(req.user);
    next();
  } catch (error) {
    next(error);
  }
};

export const requirePremium = (req, res, next) => {
  if (!req.user || !isUserPremium(req.user)) {
    logger.warn(`Premium access denied for user: ${req.user?._id || 'unknown'}`);
    return next(new AppError("This feature requires an active Premium Membership.", 403));
  }
  next();
};
