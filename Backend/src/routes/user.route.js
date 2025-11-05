import express from "express";
import {protect} from "../middleware/auth.middleware.js"

import UserController from "../controllers/user.js";

const router = express.Router();
router.get("/user/request/received", protect, UserController.getConnectionRequests);
router.get("/user/connections", protect,UserController.getAllConnections);
router.get("/user/feed", protect, UserController.getFeeds);


export default router;
