import jwt from "jsonwebtoken";
import User from "../models/user.js";
import logger from "../utils/logger.js";
import AppError from "../utils/AppError.js";


export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return new AppError("Not authorized, token missing", 401);
      // return res.status(401).json{ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(!decoded){
      logger.info("Invalid or expired token")
      return new AppError("Invalid or expired token", 401);
    }
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
