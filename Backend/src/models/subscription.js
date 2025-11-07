import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentId: {
      type: String,
    },
    razorpayOrderId: {
      type: String,
      required: true,
    },
    receipt: { type: String },
    amount: {
      type: Number, 
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: ["created", "paid", "failed"],
      default: "created",
    },
    notes: {
      email: { type: String },
      firstName: { type: String },
      lastName: { type: String },
      membershipType: {
        type: String,
        required: true,
        enum: ["Silver", "Gold"],
      },
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
