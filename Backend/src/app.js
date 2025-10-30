import express from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import {connectDB} from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
import './config/db.js';
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
// Import and use your routes here  

connectDB().then(() => {
  console.log('Database connection established');
}).catch((err) => {
  console.error('Database connection error:', err);
} );



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
