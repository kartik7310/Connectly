import ProfileService from "../services/user.js";
const ProfileController = {
  async profile(req, res) {
    try {
      const userId = req.user.id;
      const user = await ProfileService.getProfile(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
     res.status(200).json({ message: "User profile retrieved successfully", data: user });
    } catch (error) {
    res.status(400).json({ message: "Invalid user data", error });
  }
},

};

export default ProfileController;