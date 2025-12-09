import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [2, "First name must be at least 2 characters long"],
      maxLength: [50, "First name must not exceed 50 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      minLength: [6, "Password must be at least 6 characters long"],
      required: function () {
        return !this.authProvider || this.authProvider === "local";
      },
    },
    age: { type: Number, min: [18, "User must be at least 18 years old"] },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
    },
    skills: { type: [String], default: [] },
    about: {
      type: String,
      default: "This is a default about of the user!",
      maxLength: [300, "About section must not exceed 300 characters"],
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      
    },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isPremium: { type: Boolean, default: false },
    membershipType: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
