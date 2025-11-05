import express from "express";
import {protect} from "../middleware/auth.middleware.js"

import ProfileController from "../controllers/profile.js";

const router = express.Router();
router.get("/view", protect, ProfileController.getProfile);
router.patch("/update", protect, ProfileController.updateProfile);


export default router;
