

import logger from "../config/logger.js";
import bcrypt from "bcrypt";
import OTP from "../models/otp.js";
import AuthService from "../services/auth.js";
import AppError from "../utils/AppError.js";
import { secureOtpGenerator } from "../utils/generateOtp.js";
import { generateToken } from "../utils/generateToken.js";
import { sendOtpSchema } from "../validators/otp.js";
import { signupSchema, loginSchema } from "../validators/user.js"

const AuthController = {
 async sendOtp(req, res, next){
  try {
 const result = sendOtpSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => err.message).join(", ");
    return next(new AppError(`Invalid input data: ${errorMessages}`, 400));
  }
  const {email} = result.data;
  
    // Rate limiting: Check if OTP was sent recently (within 1 minute)
    const recentOTP = await OTP.findOne({
      identifier: email,
      createdAt: { $gt: new Date(Date.now() - 60000) }
    });

    if (recentOTP) {
      return next(new AppError('Please wait before sending another OTP', 429))
    }

    // Generate OTP
    const otp = secureOtpGenerator();
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Store OTP in database
    await OTP.create({
      identifier: email,
      otp: hashedOTP,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      attempts: 0,
      isUsed: false
    });

    // Send OTP via email
    // await sendOTPEmail(email, otp, 'login');

    res.status(200).json({
      success: true,
      otp,
      message: 'OTP sent successfully to your email',
      expiresIn: 300 // seconds
    });

  } catch (error) {
    console.error('Send OTP error:', error);
   next(error);
    
  }
 },
    
async verifyOtp(req, res, next){
  try {
     const result = sendOtpSchema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map((err) => err.message).join(", ");
    return next(new AppError(`Invalid input data: ${errorMessages}`, 400));
  }

  const {email,otp} = result.data;
   const otpRecord = await OTP.findOne({
      identifier: email,
      isUsed: false,
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }
       if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return next(new AppError('Too many attempts. Please try again later.', 429))
    }
     const isValidOTP = await bcrypt.compare(otp, otpRecord.otp);
  if (!isValidOTP) {
      // Increment attempts
      otpRecord.attempts += 1;
      await otpRecord.save();
       return next (new AppError(`Invalid OTP. ${3 - otpRecord.attempts} attempts remaining`))
  }
  
    // Mark OTP as used
    otpRecord.isUsed = true;
    await otpRecord.save();

    // Fetch user from database
    const User = await import("../models/user.js").then(m => m.default);
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    
    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    next(error);
  }
} ,
  async signup(req, res, next) {
    try {
      const parsed = signupSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: parsed.error.errors,
        });
      }

      await AuthService.signup(parsed.data);
      

      res.status(201).json({
        success:true,
        message: "User registered successfully",
      });
    } catch (err) {
      next(err);
    }
  },

   async login(req, res, next) {
  try {
   
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn("Login validation failed", { errors: parsed.error.errors });
      return next(new AppError("Validation failed", 400));
    }


    const { token,user } = await AuthService.login(parsed.data);
     logger.info("token",token);
    

 
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: "true",
        message: "Login successful",
         user,
        token,
      });

    logger.info(`User logged in: ${user.email}`);
  } catch (err) {
    logger.error("Login failed", { error: err.message });
    next(err);
  }
},

async googleLogin(req, res, next) {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      logger.warn("Google login attempt without ID token");
      return res.status(400).json({ message: "ID token is required" });
    }

    const result = await AuthService.googleLogin(idToken);
    
    logger.info("Google login success");
    return res
      .cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        user: result.user,
        token: result.token,
      });
  } catch (err) {
    logger.error("Google login failed", { error: err.message });
    next(err);
  }
}
 

,
  async logout(req, res) {
    res
      .cookie("token", null, {
        expires: new Date(0),
        httpOnly: true,
      })
      .status(200)
      .json({ message: "Logout successful" });
  },
};

export default AuthController;
