import express from "express";
import {protect} from "../middleware/auth.middleware.js"
import { checkLimit } from "../middleware/checkLimit.js";
import ConnectionController from "../controllers/connectionRequest.js";
const router = express.Router();
router.post("/request/send/:status/:toUserId", protect, checkLimit("connection"), ConnectionController.sendConnectionRequest);
router.post("/request/review/:requestId/:status", protect, ConnectionController.reviewConnectionRequests);



export default router;
