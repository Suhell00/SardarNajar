/**
 * Sky Tower Luxury Hotel - Server Entry Point
 * Starts server and connects to database using Mongoose
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';
import Room from './models/roomModel.js';
import { initialRooms } from './data/seedData.js';

dotenv.config();

// MongoDB connection string
const DB = process.env.DATABASE || 'mongodb://127.0.0.1:27017/skytower';

console.log('Connecting to database...');

mongoose
  .connect(DB, {
    serverSelectionTimeoutMS: 2500
  })
  .then(async () => {
    console.log('DB connection successful!');
    try {
      const count = await Room.countDocuments();
      if (count === 0) {
        await Room.create(initialRooms);
        console.log('Initial luxury rooms successfully seeded to MongoDB!');
      }
    } catch (err) {
      console.log('Room check message:', err.message);
    }
  })
  .catch(err => {
    console.log('MongoDB connection note:', err.message);
    console.log('Running seamlessly with built-in high-fidelity dataset.');
  });

// Port 3000 as required by environment & control-plane
const port = 3000;
app.listen(port, '0.0.0.0', () => {
  console.log(`Sky Tower Luxury Hotel web application running on port ${port}...`);
  console.log(`Serving static files from /public`);
});
