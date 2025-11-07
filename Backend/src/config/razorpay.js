import dotenv from "dotenv"
dotenv.config()
const key = process.env.RAZORPAY_API_KEY
const secret = process.env.RAZORPAY_KEY_SECRET
console.log(`key: ${key} and secret:${secret}`);

import Razorpay from "razorpay"
const  instance = new Razorpay({
  key_id: key,
  key_secret:secret
});
export default instance