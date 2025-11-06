import express from "express";
import {protect} from "../middleware/auth.middleware.js"

import UserController from "../controllers/user.js";

const router = express.Router();
router.get("/request/received", protect, UserController.getConnectionRequests);
router.get("/connections", protect,UserController.getAllConnections);
router.get("/feed", protect, UserController.getFeeds);


export default router;
