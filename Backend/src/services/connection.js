import ConnectionRequest from "../models/connectionRequest.js";
import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.js";
import mongoose from "mongoose";
const ConnectionService = {
  async createConnectionRequest(reqObject) {

    
    const { FromUser, ToUser, status } = reqObject;

    const allowedStatus = ["ignored", "interested", "accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      logger.warn(`Invalid status type: ${status}`);
      throw new AppError("Invalid status type", 400);
    }

    try {
     
      const toUser = await User.findById(ToUser).select("-password");

      if (!toUser) {
        logger.warn(`Target user not found: ${ToUser}`);
        throw new AppError("Target user not found", 404);
      }
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: FromUser, toUserId: ToUser },
          { fromUserId: ToUser, toUserId: FromUser },
        ],
      });

      if (existingConnection) {
        logger.warn(
          `Connection request already exists between ${FromUser} and ${ToUser}`
        );
        throw new AppError("Connection request already exists", 400);
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId: FromUser,
        toUserId: ToUser,
        status,
      });

      await connectionRequest.save();

      logger.info(
        `Connection request created from ${FromUser} → ${ToUser} with status: ${status}`
      );

      return connectionRequest;
    } catch (error) {
      logger.error("Error creating connection request", { error });
      throw new AppError(
        error.message || "Failed to create connection request",
        error.statusCode || 500
      );
    }
  },

  async reviewConnectionRequest(payload){
    
    try {
      const {loggedInUser,requestId,status} = payload;
      const allowedStatus = [ "accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        logger.warn(`Invalid status type: ${status}`);
        throw new AppError("Invalid status type",400);
      }
      const connectionReq = await ConnectionRequest.findOne({
          _id: new mongoose.Types.ObjectId(requestId),      
      toUserId: new mongoose.Types.ObjectId(loggedInUser), 
      status: "interested"
      });
      console.log("connectionReq",connectionReq);
      
      if(!connectionReq){
        logger.warn(`Connection request not found: ${requestId}`);
        throw new AppError("Connection request not found",404);
      }
     connectionReq.status = status;
     await connectionReq.save();
     logger.info(`Connection request ${requestId} reviewed with status: ${status}`);
     return connectionReq;
    } catch (error) {
      logger.error("Error reviewing connection request", { error });
      throw new AppError(
        error.message || "Failed to review connection request",
        error.statusCode || 500
      );
    }
  },
 
};

export default ConnectionService;
