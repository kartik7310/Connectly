import express from "express";
import AuthController from "../controllers/auth.js";
import authenticateUser from "../middleware/auth.middleware.js";
import ProfileController from "../controllers/user.js";
const router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);


export default router;
