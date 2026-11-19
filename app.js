/**
 * Sky Tower Luxury Hotel - Express Application
 * Configured according to Jonas Schmedtmann's MVC architecture
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import roomRouter from './routes/roomRoutes.js';
import * as roomController from './controllers/roomController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1) GLOBAL MIDDLEWARES
// Body parser, reading data from body into req.body
app.use(express.json());

// Serving static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware (Bootcamp style)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) API ROUTES
app.use('/api/v1/rooms', roomRouter);
app.post('/api/v1/bookings', roomController.createBooking);

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    hotel: 'Sky Tower Erbil (سکای تاوەر هەولێر)',
    phone: '07501303137',
    location: 'Erbil, Kurdistan Region',
    timestamp: req.requestTime
  });
});

// Fallback for HTML5 client routing to public/index.html
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({
      status: 'fail',
      message: `Can't find ${req.originalUrl} on this server!`
    });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;
