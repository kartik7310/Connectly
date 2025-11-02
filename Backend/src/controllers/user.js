
import ProfileService from "../services/user.js";

const ProfileController = {
  async getProfile(req, res) {
    try {
      const user = req.user; 
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send("ERROR: " + err.message);
    }
  },
   async getConnectionRequests(req, res, next) {
    try {
      const loggedInUser = req.user._id;
      const connectionRequests = await ProfileService.getConnectionRequests(loggedInUser);
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
      const connections = await ProfileService.getAllConnections(loggedInUser);
      res.status(200).json({
        success: true,
        message: "Connections retrieved successfully",
        data: connections,
      });
    } catch (error) {
      next(error);
    }
  },
}

export default ProfileController;