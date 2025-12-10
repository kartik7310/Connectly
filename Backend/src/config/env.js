import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  mongoUri: process.env.MONGODB_URI,
  
  // JWT
  jwtSecret: process.env.JWT_SECRET,
  
  // Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  
  // ImageKit
  imagekit: {
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  },
  
  // Razorpay
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
  },

 //redis
  redisUrl:process.env.REDIS_URL,

  
  // CORS - supports comma-separated origins
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
};

// Validation - throw error if critical configs are missing
if (!config.mongoUri) {
  throw new Error('MONGODB_URI is required in environment variables');
}

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is required in environment variables');
}

export default config;
