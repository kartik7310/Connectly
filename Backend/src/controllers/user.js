

import mongoose from "mongoose";
import UserService from "../services/user.js";

const UserController = {
  async getConnectionRequests(req, res, next) {
    try {
      const loggedInUser = req.user._id;
      const connectionRequests = await UserService.getConnectionRequests(loggedInUser);
      res.status(200).json({
        success: true,
        message: "Connection requests retrieved successfully",
        data: connectionRequests,
      });
    } catch (error) {
      next(error);
    }
  },
  async getAllConnections(req, res, next) {
    try {
      const loggedInUser = req.user._id;
      const connections = await UserService.getAllConnections(loggedInUser);
      res.status(200).json({
        success: true,
        message: "Connections retrieved successfully",
        data: connections,
      });
    } catch (error) {
      next(error);
    }
  },

  async getFeeds(req, res, next) {
    try {
      const loggedInUser = req.user._id;
      const page = Math.max(1, parseInt(req.query.page) || 1);
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit;
      const skip = (page - 1) * limit;

      const feeds = await UserService.getFeeds(loggedInUser, { limit, skip });

      res.status(200).json({
        success: true,
        message: "Feeds retrieved successfully",
        data: feeds,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPublicProfile(req, res, next) {
    try {
      const { identifier } = req.params;
      if (!identifier) return next(new Error("User identifier is required"));
      const loggedInUserId = req?.user?._id || null;
      const profileData = await UserService.getPublicProfile(identifier, loggedInUserId);
      res.status(200).json({
        success: true,
        message: "Public profile retrieved successfully",
        data: profileData,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUserById(req, res, next) {
    try {
      const { userId } = req.params;
      if (!userId) return next(new Error("User ID is required"));
      const loggedInUserId = req?.user?._id || null;
      const profileData = await UserService.getPublicProfile(userId, loggedInUserId);
      res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: profileData,
      });
    } catch (error) {
      next(error);
    }
  },
}

export default UserController;