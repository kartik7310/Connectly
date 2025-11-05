import User from "../models/user.js";

const ProfileService = {
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error("Error retrieving user profile");
    }
  },

  async updateProfile(userId, payload) {
    try {
      // remove undefined values 
      const updateData = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return updatedUser;
    } catch (error) {
      throw new Error(error.message || "Error updating user profile");
    }
  },
};

export default ProfileService;
