// 📁 server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authroutes.js';
import trackRoutes from './routes/trackroutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ['http://localhost:5500', 'http://127.0.0.1:5500'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultfallbacksecret',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24
  }
}));

app.use('/api/auth', authRoutes);
app.use('/api', trackRoutes);

connectDB();
app.listen(port, () => console.log(`Server running on port ${port}`));
