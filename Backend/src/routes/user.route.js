import express from "express";
import {protect} from "../middleware/auth.middleware.js"
import ProfileController from "../controllers/user.js";

const router = express.Router();
router.get("/view", protect, ProfileController.getProfile);
router.get("/user/request/received", protect, ProfileController.getConnectionRequests);
router.get("/user/connections", protect, ProfileController.getAllConnections);


export default router;
