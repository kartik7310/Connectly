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
};
 export default ProfileService;