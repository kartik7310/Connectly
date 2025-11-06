
import logger from "../config/logger.js";
import ProfileService from "../services/profile.js"
import AppError from "../utils/AppError.js";
import { updateUserSchema } from "../validators/user.js";

const ProfileController = {
  async getProfile(req, res) {
    try {
      const user = req.user; 
      res.status(200).json(user);
    } catch (err) {
      res.status(500).send("ERROR: " + err.message);
    }
  },
 
 async updateProfile (req, res){
  try {
    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      logger.warn("Validation failed on updateProfile request", parsed.error.flatten());
      throw new AppError("Validation failed", 400);
    }

    const userId = req?.user?.id || req.params.userId;
    if (!userId) {
      logger.warn("Unauthorized access attempt on updateProfile");
      throw new AppError("Unauthorized", 401);
    }

    const updatedUser = await ProfileService.updateProfile(userId, parsed.data);

    logger.info(`User profile updated successfully for userId: ${userId}`);

    return res.status(200).json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    logger.error("updateProfile controller error:", error);

    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Something went wrong"
    });
  }
}
}

export default ProfileController;