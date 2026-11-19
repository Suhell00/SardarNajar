/**
 * Room Routes
 * Follows Jonas Schmedtmann's routing architecture
 */

import express from 'express';
import * as roomController from '../controllers/roomController.js';

const router = express.Router();

// Special alias route for top 3 rooms
router
  .route('/top-3-rooms')
  .get(roomController.aliasTopRooms, roomController.getAllRooms);

// Booking creation endpoint
router
  .route('/book')
  .post(roomController.createBooking);

// Standard RESTful routes
router
  .route('/')
  .get(roomController.getAllRooms)
  .post(roomController.createRoom);

router
  .route('/:id')
  .get(roomController.getRoom)
  .patch(roomController.updateRoom)
  .delete(roomController.deleteRoom);

export default router;
