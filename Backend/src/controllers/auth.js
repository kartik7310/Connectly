
import logger from "../config/logger.js";
import AuthService from "../services/auth.js";
import { signupSchema, loginSchema } from "../validators/user.js"
import { client } from "../config/googleOauth.js";
import User from "../models/user.js";
import { generateToken } from "../utils/generateToken.js";

const AuthController = {
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
 
// async googleLogin(req, res, next) {

//   try {
//     const { idToken } = req.body;
    
//     if (!idToken) {
//       logger.warn("Google login attempt without ID token");
//       return res.status(400).json({ message: "ID token is required" });
//     }

  
//     const ticket = await client.verifyIdToken({
//       idToken,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//     logger.error("token not verify")
//     const payload = ticket.getPayload();
    
    
//     if (!payload || !payload.email_verified) {
//       return res.status(400).json({ message: "Google account email not verified" });
//     }
// const { email, given_name:firstName, family_name:lastName, picture:photoUrl } = payload;

//     // Find or create user
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({
//         email, firstName, lastName, password:undefined, photoUrl, isVerified: true, provider: "google",
//       });
//     } else if (user.provider !== "google") {
//       user.provider = "google";
//      user.photoUrl = photoUrl || user.photoUrl;
//       await user.save();
//     }
   
//    const token = generateToken(user._id, process.env.JWT_SECRET, '7d');
//     logger.warn("google login success")
//     return res
//       .cookie("token", token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//       })
//       .status(200)
//       .json({
//         success: true,
//         message: "Login successful",
//         user: {
//           id: user._id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           photoUrl: user.photoUrl,
//           provider: user.provider,
//         },
//         token,
//       });
//   } catch (err) {
//     logger.error("Login failed", { error: err.message }); next(err);
//   }
// },,
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
