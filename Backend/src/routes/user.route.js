import express from "express";
import { protect } from "../middleware/auth.middleware.js"

import UserController from "../controllers/user.js";

const router = express.Router();
router.get("/request/received", protect, UserController.getConnectionRequests);
router.get("/connections", protect, UserController.getAllConnections);
router.get("/feed", protect, UserController.getFeeds);
router.get("/profile/:identifier", protect, UserController.getPublicProfile);
router.get("/:userId", protect, UserController.getUserById);


export default router;
