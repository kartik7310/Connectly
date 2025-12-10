import instance from "../config/razorpay.js";
import logger from "../config/logger.js";
import AppError from "../utils/AppError.js";
import { membershipType } from "../utils/planType.js";
import Subscription from "../models/subscription.js";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils.js";
import User from "../models/user.js";
import { config } from "../config/env.js";
const SubscriptionController = {
  async createOrder(req, res, next) {
    try {
      const { firstName, lastName, email, _id: userId } = req.user;
      const { planType } = req.body;
      logger.info("Creating order", { planType, userId });

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
        payment_capture: 1,
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
        razorpayOrderId: razorpayOrder.id,
        membershipType: planType,
        amount: amount,
        receipt: razorpayOrder.receipt,
        currency: "INR",
        status: "created",
        notes: razorpayOrder.notes,
        createdAt: new Date(),
      });

      const savedSubscription = await subscription.save();

     
      logger.info("Order created successfully", {
        userId,
        orderId: razorpayOrder.id,
        membershipType: planType,
      });

  
      const data = savedSubscription.toJSON()
      res.status(201).json({
        success: true,
        message: "Order created successfully",
        data,
      });
    } catch (error) {
      
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

      
      if (error instanceof AppError) {
        return next(error);
      }

      next(
        new AppError("Failed to create order. Please try again later.", 500)
      );
    }
  },
  
  //after deploy need to setup webhook for verification
  async verifyPaymentWebhook(req, res, next) {
    try {
      const signature = req.get("x-razorpay-signature");
      const isWebhookValid = validateWebhookSignature(
        JSON.stringify(req.body),
        signature,
        config.razorpay.webhookSecret
      );
      
      if (!isWebhookValid) {
        return next(new AppError("Invalid signature", 400));
      }

      // Update subscription status in db
      const paymentDetails = req.body.payload.payment.entity;
      const subscription = await Subscription.findOne({
        razorpayOrderId: paymentDetails.order_id
      });
      
      if (!subscription) {
        return next(new AppError("Subscription not found", 404));
      }
      
      subscription.status = paymentDetails.status;
      await subscription.save();
      
      const user = await User.findById(subscription.userId);
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      
      user.isPremium = true;
      user.membershipType = subscription?.notes?.membershipType;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Webhook received successfully"
      });
    } catch (error) {
      next(new AppError(error.message, error.statusCode || 500));
    }
  },
  async getSubscriptions(req, res, next) {
    try {
      const user = req.user.toJSON();
      logger.info("getSubscriptions", { user });
      if (user.isPremium) {
        return res.status(200).json({ isPremium: true });
      }
      return res.status(200).json({ isPremium: false });
    } catch (error) {
      next(error);
    }
  },
};

export default SubscriptionController;
