import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import tasksRouter from './routes/tasks.js';

dotenv.config();

const app = express();

// CORS FIX
app.use(cors({
  origin: ["http://127.0.0.1:5501", "http://localhost:5501"],
  credentials: true
}));

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req,res)=>{
  res.json({ ok: true, ts: new Date().toISOString() });
});
app.use('/api/tasks', tasksRouter);

// 404 handler
app.use((req,res)=>{
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next)=>{
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

// Start server after DB connect
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mern_todo';

mongoose.connect(MONGO_URI)
  .then(()=>{
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log(`API running on http://localhost:${PORT}`));
  })
  .catch((e)=>{
    console.error('MongoDB connection failed:', e.message);
    process.exit(1);
  });
