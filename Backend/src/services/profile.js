import User from "../models/user.js";
import { checkAndExpireUser } from "../utils/membership.js";

const ProfileService = {
  async getProfile(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.username) {
        const cleanName = (user.firstName || "user").toLowerCase().replace(/[^a-z0-9_]/g, "");
        user.username = `${cleanName}_${user._id.toString().slice(-6)}`;
        await user.save();
      }
      await checkAndExpireUser(user);
      return user;
    } catch (error) {
      throw new Error(error.message || "Error retrieving user profile");
    }
  },

  async updateProfile(userId, payload) {
    try {
      // remove undefined values 
      const updateData = Object.fromEntries(
        Object.entries(payload).filter(([_, v]) => v !== undefined)
      );

      if (updateData.username) {
        updateData.username = updateData.username.toLowerCase().trim();
        const existingUser = await User.findOne({
          username: updateData.username,
          _id: { $ne: userId }
        });
        if (existingUser) {
          throw new Error("Username is already taken");
        }
      }

      if (updateData.bio !== undefined && updateData.about === undefined) {
        updateData.about = updateData.bio;
      } else if (updateData.about !== undefined && updateData.bio === undefined) {
        updateData.bio = updateData.about;
      } else if (updateData.bio !== undefined && updateData.about !== undefined) {
        updateData.about = updateData.bio;
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      await checkAndExpireUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || "Error updating user profile");
    }
  },
};

export default ProfileService;
