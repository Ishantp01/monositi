import 'dotenv/config';
import express from 'express';
import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

// Connect to MongoDB
await connectDB();
dotenv.config();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error('Shutting down the server due to Uncaught Exception');
  process.exit(1);
});

export default server;
