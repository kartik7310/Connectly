import bcrypt from "bcrypt";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import logger from "../config/logger.js";
import { generateToken } from "../utils/generateToken.js";
import { client } from "../config/googleOauth.js";
import { sendOtpSchema } from "../validators/otp.js";
import OTP from "../models/otp.js";


const AuthService = {
 

  async signup(data) {
    const { firstName, lastName, email, password, age } = data;

    const existing = await User.findOne({ email });
   
    if (existing) {
        logger.warn(`Signup attempt with existing email: ${email}`);
    throw new AppError("User already exists with this email", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
    });

    return logger.info(`New user registered: ${email}`);
  },

  async login(data) {
    const { email, password } = data;
    const user = await User.findOne({ email });
    logger.debug("Login attempt", { email });
    
   if (!user) {
   throw new AppError("Invalid credentials", 401);
  }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed - incorrect password: ${email}`);
      throw new AppError("Invalid credentials", 401);
    }
  

    const token = generateToken(user._id);
     const { password: _, ...safeUser } = user.toObject();
    return {token ,user:safeUser};
  },
  
  async googleLogin(idToken) {
  
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  
  if (!payload || !payload.email_verified) {
    throw new Error("Google account email not verified");
  }

  const { email, given_name: firstName, family_name: lastName, picture: photoUrl } = payload;

  // Find or create user
  let user = await User.findOne({ email });
  
  if (!user) {
    user = await User.create({
      email,
      firstName,
      lastName,
      password: undefined,
      photoUrl,
      isVerified: true,
      authProvider: "google",
    });
  } else if (user.authProvider !== "google") {
    user.authProvider = "google";
    user.photoUrl = photoUrl || user.photoUrl;
    await user.save();
  }

  // Generate token
  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      photoUrl: user.photoUrl,
      authProvider: user.authProvider,
    },
  };
}
};

export default AuthService;
