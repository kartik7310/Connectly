import instance from "../config/razorpay.js";
import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";
import { membershipType } from "../utils/planType.js";
import Subscription from "../models/subscription.js";
const SubscriptionController = {
  async createOrder(req, res, next) {
    try {
      const { firstName, lastName, email, _id: userId } = req.user;
      const { planType } = req.body;
      console.log("member", planType);

      if (!planType || !membershipType[planType]) {
        throw new AppError("Invalid membership type provided", 400);
      }

      if (!firstName || !lastName || !email || !userId) {
        throw new AppError("User information is incomplete", 400);
      }

      const amount = membershipType[planType];

      const razorpayOrder = await instance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `rcpt_${firstName}_${Date.now()}`,
        notes: {
          firstName,
          lastName,
          email,
          userId,
          membershipType: planType,
        },
      });

      const subscription = new Subscription({
        userId,
        orderId: razorpayOrder.id,
        razorpayOrderId: razorpayOrder.id,
        membershipType: planType,
        amount: amount,
        receipt: razorpayOrder.receipt,
        currency: "INR",
        status: "created",
        razorpayOrderId: razorpayOrder.id,
        notes: razorpayOrder.notes,
        createdAt: new Date(),
      });

      const savedSubscription = await subscription.save();

      // Log successful order creation
      logger.info("Order created successfully", {
        userId,
        orderId: razorpayOrder.id,
        membershipType: planType,
      });

      // Send response
      const data = savedSubscription.toJSON()
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data,
      });
    } catch (error) {
      // Log error
      logger.error("Error creating order", {
        error: error.message,
        stack: error.stack,
        userId: req.user?.userId,
      });

      // Handle Razorpay specific errors
      if (error.error && error.error.description) {
        return next(
          new AppError(`Payment gateway error: ${error.error.description}`, 500)
        );
      }

      // Pass error to error handling middleware
      if (error instanceof AppError) {
        return next(error);
      }

      next(
        new AppError("Failed to create order. Please try again later.", 500)
      );
    }
  },
};

export default SubscriptionController;
