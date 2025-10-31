import { loginSchema, signupSchema } from "../validators/user.js";
import  authService  from "../services/user.js";  

const AuthController = {
  async signup(req, res) {
    try {
      const validatedData = signupSchema.safeParse(req.body);
      if (!validatedData.success) {
          return res.status(400).json({ message: "Invalid user data", errors: validatedData.error.errors });
      }

     const user = await authService.signup(validatedData.data);
     const { password, ...userData } = user;
     res.status(201).json({ message: "User signed up successfully", data: userData });
    } catch (error) {
    res.status(400).json({ message: "Invalid user data", error });
  }
},
async login(req, res) {
    try {
       const validatedData = loginSchema.safeParse(req.body);
      if (!validatedData.success) {
          return res.status(400).json({ message: "Invalid user data", errors: validatedData.error.errors });
      }
      const { result, token } = await authService.login(validatedData.data);
      const { password, ...userData } = result;

res.status(200).cookie("token", token, {
    httpOnly: true,   
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",  
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  })
  .json({ message: "Login successful", data: userData });

    } catch (error) {
      res.status(400).json({ message: "Login failed", error: error.message });
    }
  }

};

export default AuthController;