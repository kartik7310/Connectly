import express from "express";
import {protect} from "../middleware/auth.middleware.js"

import SubscriptionController from "../controllers/subscription.js";

const router = express.Router();
router.post("/order-create", protect, SubscriptionController.createOrder);



export default router;
