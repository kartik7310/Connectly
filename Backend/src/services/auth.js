import bcrypt from "bcrypt";
import User from "../models/user.js";
import AppError from "../utils/AppError.js";
import logger from "../config/logger.js";
import { generateToken } from "../utils/generateToken.js";
import { client } from "../config/googleOauth.js";
import { sendOtpSchema } from "../validators/otp.js";
import OTP from "../models/otp.js"
import { config } from "../config/env.js";
import { sendVerificationTokenEmail } from "../mails/verification.js";
import { OTP_CONFIG, secureOtpGenerator } from "../utils/otpGenerator.js";
import otpHashing from "../utils/otpHashing.js";
import { sendForgotPasswordTokenEmail } from "../mails/forgotPassword.js";
import { sendResetPasswordSuccessEmail } from "../mails/resetPassword.js";
import EmailRegex from "../utils/EmailRegex.js";
import { checkAndExpireUser } from "../utils/membership.js";


const AuthService = {
  

  async signup(data) {

    const { firstName, lastName, email, password, age ,otp} = data;

    const existing = await User.findOne({ email });
   
    if (existing) {
        logger.warn(`Signup attempt with existing email: ${email}`);
    throw new AppError("User already exists with this email", 400);
    }
     const existingOtp = await OTP.findOne({ email, used: false });

     logger.info(`Existing OTP: ${existingOtp}`);
     if (!existingOtp) {
      throw new AppError("Invalid or Expired OTP", 400);
     }

    const hashedOtp = otpHashing(otp);

    if (hashedOtp !== existingOtp.otp) {
      throw new AppError("Invalid OTP", 400);
    }

  const isOtpExpired = existingOtp.expiresAt < new Date();
     if (isOtpExpired) {
      await OTP.deleteOne({ _id: existingOtp._id });
      throw new AppError("OTP has expired", 400);
     }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
    });
    await OTP.updateOne({ _id: existingOtp._id }, { Used: true });
    return logger.info(`New user registered: ${email}`);
  },

  async otpSend (data) {
    const { email } = data;
     if(!email){
      throw new AppError("Email is required", 400);
     }

    EmailRegex(email);
    await OTP.deleteMany({ email });
    const otp = secureOtpGenerator(OTP_CONFIG.LENGTH);
 
    const hashedOtp = otpHashing(otp);


    await OTP.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000),
      Used:false // 5 minutes
     
   
    });

    await sendVerificationTokenEmail(email,otp)
    return logger.info(`OTP sent to: ${email}`);
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
  

    await checkAndExpireUser(user);
    const token = generateToken(user._id);
     const { password: _, ...safeUser } = user.toObject();
    return {token ,user:safeUser};
  },
  
  async googleLogin(idToken) {
  
  const ticket = await client.verifyIdToken({
    idToken,
    audience: config.googleClientId,
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

  await checkAndExpireUser(user);

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
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionEndDate: user.subscriptionEndDate
    },
  };
},

    async forgotPassword(email){
        EmailRegex(email);
      const user = await User.findOne({ email });
      if (!user) {
        logger.info(`Forgot password attempt for non-existent email: ${email}`);
        throw new AppError(`Forgot password attempt for non-existent email: ${email}`, 404);
      }
      // Delete any previous forgot-password OTPs for this email
      await OTP.deleteMany({ email, purpose: "password_reset" });

      const otp = secureOtpGenerator(OTP_CONFIG.LENGTH);

      const hashedOtp = otpHashing(otp);

      await OTP.create({
        email,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + OTP_CONFIG.EXPIRY_MINUTES * 60 * 1000),
        Used:false, // 5 minutes
      purpose: "password_reset",
      });

      await sendForgotPasswordTokenEmail(email,user.firstName,otp)
      return logger.info(`OTP sent to: ${email}`);
    },

    async resetPassword(data) {
      const { email, otp, password, confirmPassword } = data;

      if (password !== confirmPassword) {
        throw new AppError("Passwords do not match", 400);
      }

      const user = await User.findOne({ email });
      if (!user) {
        logger.info(`Password reset attempt for non-existent email: ${email}`);
        return; 
      }

      const otpDoc = await OTP.findOne({
        email,
        purpose: "password_reset",
        used: false,
      });

      if (!otpDoc) {
        throw new AppError("Invalid or expired OTP", 400);
      }

      if (new Date() > otpDoc.expiresAt) {
        await OTP.deleteOne({ _id: otpDoc._id });
        throw new AppError("OTP has expired", 400);
      }

      const MAX_OTP_ATTEMPTS = 5;
      if (otpDoc.attempts >= MAX_OTP_ATTEMPTS) {
        await OTP.deleteOne({ _id: otpDoc._id });
        throw new AppError(
          "Too many OTP attempts. Please request a new OTP.",
          429
        );
      }

      const hashedOtp = otpHashing(otp);
      if (hashedOtp !== otpDoc.otp) {
        await OTP.updateOne({ _id: otpDoc._id },{ $inc: { attempts: 1 } }
        );
        throw new AppError("Invalid OTP", 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.updateOne({ _id: user._id }, { password: hashedPassword });
      await OTP.updateOne({ _id: otpDoc._id }, { $set: { used: true } });

      await OTP.deleteMany({email,purpose: "password_reset", used: false});
        await sendResetPasswordSuccessEmail(email,user.firstName)
      logger.info(`Password successfully reset for: ${email}`);
    },
  
    }

    export default AuthService;
