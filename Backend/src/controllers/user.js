
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

  async getFeeds(req, res, next) {
  try {
    const loggedInUser = req.user._id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const feeds = await ProfileService.getFeeds(loggedInUser, { limit, skip });

    res.status(200).json({
      success: true,
      message: "Feeds retrieved successfully",
      data: feeds,
    });
  } catch (error) {
    next(error);
  }
},
}

export default ProfileController;