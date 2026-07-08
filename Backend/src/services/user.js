import mongoose from "mongoose";
import logger from "../config/logger.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
import Blog from "../models/blog.js";
import AppError from "../utils/AppError.js";
import { checkAndExpireUser } from "../utils/membership.js";

const POPULATE_FIELDS = "firstName lastName username bio age photoUrl coverImage profession location website socialLinks skills about gender ";
const UserService = {
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      console.log("user", user);

      if (!user) {
        throw new Error("User not found");
      }
      await checkAndExpireUser(user);
      return user;
    } catch (error) {
      throw new Error("Error retrieving user profile");
    }
  },

  async getPublicProfile(identifier, loggedInUserId) {
    try {
      let query = [];
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        query.push({ _id: identifier });
      }
      query.push({ username: identifier.toLowerCase().trim() });

      const targetUser = await User.findOne({ $or: query }).select("-password -otp");
      if (!targetUser) {
        throw new Error("User profile not found");
      }

      if (!targetUser.username) {
        const cleanName = (targetUser.firstName || "user").toLowerCase().replace(/[^a-z0-9_]/g, "");
        targetUser.username = `${cleanName}_${targetUser._id.toString().slice(-6)}`;
        await targetUser.save();
      }

      await checkAndExpireUser(targetUser);

      const blogCount = await Blog.countDocuments({ author: targetUser._id });
      const blogs = await Blog.find({ author: targetUser._id }).sort({ createdAt: -1 }).limit(20);

      const connectionCount = await ConnectionRequest.countDocuments({
        $or: [
          { fromUserId: targetUser._id, status: "accepted" },
          { toUserId: targetUser._id, status: "accepted" }
        ]
      });

      let connectionStatus = "not_connected";
      let isConnected = false;
      let requestId = null;

      if (loggedInUserId && loggedInUserId.toString() === targetUser._id.toString()) {
        connectionStatus = "self";
      } else if (loggedInUserId) {
        const connReq = await ConnectionRequest.findOne({
          $or: [
            { fromUserId: loggedInUserId, toUserId: targetUser._id },
            { fromUserId: targetUser._id, toUserId: loggedInUserId }
          ]
        });

        if (connReq) {
          if (connReq.status === "accepted") {
            connectionStatus = "connected";
            isConnected = true;
          } else if (connReq.status === "interested") {
            if (connReq.fromUserId.toString() === loggedInUserId.toString()) {
              connectionStatus = "request_sent";
            } else {
              connectionStatus = "request_received";
              requestId = connReq._id;
            }
          }
        }
      }

      return {
        user: targetUser,
        connectionStatus,
        isConnected,
        requestId,
        blogCount,
        connectionCount,
        blogs
      };
    } catch (error) {
      logger.error("Error retrieving public user profile", { error, identifier });
      throw new AppError(error.message || "Error retrieving user profile", 404);
    }
  },

  async getConnectionRequests(loggedInUser) {
    try {
      // Find all connected users (status: "accepted") to ensure we never return someone who is already a friend
      const acceptedConnections = await ConnectionRequest.find({
        $or: [
          { fromUserId: loggedInUser, status: "accepted" },
          { toUserId: loggedInUser, status: "accepted" }
        ]
      }).select("fromUserId toUserId");

      const connectedUserIds = new Set();
      for (const conn of acceptedConnections) {
        if (conn.fromUserId) connectedUserIds.add(conn.fromUserId.toString());
        if (conn.toUserId) connectedUserIds.add(conn.toUserId.toString());
      }

      const connections = await ConnectionRequest.find({
        toUserId: loggedInUser,
        status: "interested",
        fromUserId: { $nin: Array.from(connectedUserIds) }
      }).populate("fromUserId", POPULATE_FIELDS);
      logger.info(`Fetched ${connections.length} connections for user: ${loggedInUser}`);
      console.log("connection", connections);

      return connections;
    } catch (error) {
      logger.error("Error fetching connections", { error });
      throw new AppError(
        error.message || "Failed to fetch connections",
        error.statusCode || 500
      );
    }
  },
  async getAllConnections(loggedInUser) {
    try {
      const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser, status: "accepted" }, { toUserId: loggedInUser, status: "accepted" }]
      }).
        populate("fromUserId", POPULATE_FIELDS)
        .populate("toUserId", POPULATE_FIELDS);
      logger.info(`Fetched ${connectionRequests.length} connection requests for user: ${loggedInUser}`);
      const data = connectionRequests.map((user) => {
        if (!user.fromUserId || !user.toUserId) return null;
        if (user.fromUserId._id.toString() === loggedInUser.toString()) {
          return user.toUserId;
        } else {
          return user.fromUserId;
        }

      }).filter(user => user !== null);

      return data;
    } catch (error) {
      logger.error("Error fetching connection requests", { error });
      throw new AppError(
        error.message || "Failed to fetch connection requests",
        error.statusCode || 500
      );
    }
  },

  async getFeeds(loggedInUser, pagination) {
    try {
      const { limit, skip } = pagination;

      // Find connections (either sent or received)
      const connections = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser }, { toUserId: loggedInUser }],
      }).select("fromUserId toUserId");

      // Collect all connected user IDs
      const hideUserFromFeeds = new Set();
      for (const conn of connections) {
        if (conn.fromUserId) hideUserFromFeeds.add(conn.fromUserId.toString());
        if (conn.toUserId) hideUserFromFeeds.add(conn.toUserId.toString());
      }

      // Fetch users excluding connected ones and self
      const users = await User.find({
        $and: [{ _id: { $nin: Array.from(hideUserFromFeeds) } },
        { _id: { $ne: loggedInUser } },
        ]
      }).select(POPULATE_FIELDS).limit(limit).skip(skip);

      return {
        users,
      };
    } catch (error) {
      logger.error("Error fetching feeds", { error, loggedInUser });
      throw new AppError(error.message || "Failed to fetch feeds", error.statusCode || 500);
    }
  }
};
export default UserService;
