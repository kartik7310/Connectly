import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import {connectDB} from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import UserRoutes from "./routes/user.route.js"
import ProfileRoutes from "./routes/profile.routes.js"
import logger from "./config/logger.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middleware/errorMiddleware.js"
import ConnectionRoutes from "./routes/connection.routes.js"
import SubscriptionRoutes from "./routes/subscription.routes.js"
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",   
    credentials: true                  
}));


import './config/db.js';



app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user',UserRoutes );
app.use('/api/v1/profile',ProfileRoutes );
app.use('/api/v1/connections', ConnectionRoutes);
app.use('/api/v1/payment', SubscriptionRoutes);

app.use(globalErrorHandler);
connectDB().then(() => {
  logger.info("MongoDB connected successfully");
}).catch((err) => {
  logger.error('Database connection error:', err);
});



app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
