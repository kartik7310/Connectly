import logger from "../config/logger.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";  

const POPULATE_FIELDS = "firstName lastName age photoUrl skills bio gender ";
const ProfileService = {
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      console.log("user",user);
      
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("Error retrieving user profile");
    }
  },

   async getConnectionRequests(loggedInUser){
    try {
      const connections = await ConnectionRequest.find({
        toUserId: loggedInUser,
        status: "interested",
      }).populate("fromUserId", POPULATE_FIELDS);
      logger.info(`Fetched ${connections.length} connections for user: ${loggedInUser}`);
      console.log("connection",connections);

      return connections;
    } catch (error) {
      logger.error("Error fetching connections", { error });
      throw new AppError(
        error.message || "Failed to fetch connections",
        error.statusCode || 500
      );
    }
  },
   async getAllConnections(loggedInUser){
    try {
      const connectionRequests = await ConnectionRequest.find({
       $or:[{fromUserId: loggedInUser,status:"accepted"},{toUserId: loggedInUser,status:"accepted"}]
      }).
      populate("fromUserId",POPULATE_FIELDS)
      .populate("toUserId",POPULATE_FIELDS);
      logger.info(`Fetched ${connectionRequests.length} connection requests for user: ${loggedInUser}`);
      const data = connectionRequests.map((user)=>{
        if(user.fromUserId._id.toString() === loggedInUser.toString()){
          return user.toUserId;
        }else{
          return user.fromUserId;
        }

      });
      
      return data;
    } catch (error) {
      logger.error("Error fetching connection requests", { error });
      throw new AppError(
        error.message || "Failed to fetch connection requests",
        error.statusCode || 500
      );
    }
  },  

  
};
 export default ProfileService;