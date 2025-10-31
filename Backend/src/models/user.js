import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age:{
    type: Number,
    required: false,
  },
  gender:{
    type: String,
    required: false,
  },
  skills:{
    type: [String],
    default: [],
    // required: false,
  },
  bio:{
    type: String,
    default:"user is lazy to write bio",
    // required: false,  
  }
});

const User = mongoose.model("User", userSchema);
export default User;
