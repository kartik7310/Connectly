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
      maxLength: [500, "About section must not exceed 500 characters"],
    },
    bio: {
      type: String,
      default: "",
      maxLength: [500, "Bio section must not exceed 500 characters"],
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    dob: {
      type: Date,
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
    },
    coverImage: {
      type: String,
      default: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80",
    },
    profession: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    website: {
      type: String,
      default: "",
      trim: true,
    },
    socialLinks: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    membershipType: { type: String },
    lastLogin: { type: Date },
    plan: { type: String, enum: ["FREE", "PREMIUM"], default: "FREE" },
    stripeSubscriptionId:{type:String},
    stripeCustomerId:{type:String},
    subscriptionStatus:{type:String,enum:["active","expired"],default:"expired"},
    subscriptionEndDate:{type:Date},
    subscriptionStartDate:{type:Date},
    blogs:[
      {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Blog"
      }
    ]

  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
