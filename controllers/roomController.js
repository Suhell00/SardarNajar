/**
 * Room Controller
 * Follows Jonas Schmedtmann's MVC patterns (Async/Await, try/catch, JSON responses)
 */

import mongoose from 'mongoose';
import Room from '../models/roomModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import { initialRooms } from '../data/seedData.js';

// In-memory store fallback when local MongoDB daemon is not running
let memoryRooms = [...initialRooms];
let bookings = [];

/**
 * Middleware: Alias top 3 luxury suites
 */
export const aliasTopRooms = (req, res, next) => {
  req.query.limit = '3';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,nameKu,nameAr,price,ratingsAverage,summary,summaryKu,summaryAr,roomType,imageCover,size,beds,baths,badge,badgeKu,badgeAr';
  next();
};

/**
 * GET all rooms with filtering, sorting, field limiting, and pagination
 */
export const getAllRooms = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      // Execute query using Jonas's APIFeatures
      const features = new APIFeatures(Room.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

      const rooms = await features.query;

      return res.status(200).json({
        status: 'success',
        results: rooms.length,
        data: {
          rooms
        }
      });
    }

    // Fallback in-memory handler for instant preview
    let results = [...memoryRooms];

    // Room type filter
    if (req.query.roomType && req.query.roomType !== 'all') {
      results = results.filter(r => r.roomType === req.query.roomType);
    }

    // Capacity filter (guests)
    if (req.query.capacity) {
      const minCap = parseInt(req.query.capacity, 10);
      results = results.filter(r => r.capacity >= minCap);
    }

    // Featured filter
    if (req.query.isFeatured !== undefined) {
      const isFeat = req.query.isFeatured === 'true';
      results = results.filter(r => r.isFeatured === isFeat);
    }

    // Sorting
    if (req.query.sort) {
      if (req.query.sort.includes('price')) {
        results.sort((a, b) => (req.query.sort.startsWith('-') ? b.price - a.price : a.price - b.price));
      } else if (req.query.sort.includes('ratingsAverage')) {
        results.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
      }
    }

    // Limit
    if (req.query.limit) {
      const limit = parseInt(req.query.limit, 10);
      results = results.slice(0, limit);
    }

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: {
        rooms: results
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * GET single room by ID
 */
export const getRoom = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const room = await Room.findById(req.params.id);

      if (!room) {
        return res.status(404).json({
          status: 'fail',
          message: 'No room found with that ID'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          room
        }
      });
    }

    // Fallback in-memory lookup
    const room = memoryRooms.find(r => r.id === req.params.id || r._id === req.params.id);

    if (!room) {
      return res.status(404).json({
        status: 'fail',
        message: 'No room found with that ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        room
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * POST create new room
 */
export const createRoom = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const newRoom = await Room.create(req.body);

      return res.status(201).json({
        status: 'success',
        data: {
          room: newRoom
        }
      });
    }

    // In-memory fallback
    const newRoom = {
      id: `room-${Date.now()}`,
      ...req.body,
      ratingsAverage: req.body.ratingsAverage || 5.0,
      ratingsQuantity: req.body.ratingsQuantity || 1,
      createdAt: new Date().toISOString()
    };
    memoryRooms.unshift(newRoom);

    res.status(201).json({
      status: 'success',
      data: {
        room: newRoom
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * PATCH update room
 */
export const updateRoom = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!updatedRoom) {
        return res.status(404).json({
          status: 'fail',
          message: 'No room found with that ID'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          room: updatedRoom
        }
      });
    }

    const index = memoryRooms.findIndex(r => r.id === req.params.id || r._id === req.params.id);
    if (index === -1) {
      return res.status(404).json({
        status: 'fail',
        message: 'No room found with that ID'
      });
    }

    memoryRooms[index] = { ...memoryRooms[index], ...req.body };

    res.status(200).json({
      status: 'success',
      data: {
        room: memoryRooms[index]
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * DELETE room
 */
export const deleteRoom = async (req, res) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const room = await Room.findByIdAndDelete(req.params.id);

      if (!room) {
        return res.status(404).json({
          status: 'fail',
          message: 'No room found with that ID'
        });
      }

      return res.status(204).json({
        status: 'success',
        data: null
      });
    }

    memoryRooms = memoryRooms.filter(r => r.id !== req.params.id && r._id !== req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

/**
 * POST create booking reservation
 */
export const createBooking = async (req, res) => {
  try {
    const { guestName, guestPhone, guestEmail, roomId, checkIn, checkOut, guests, specialRequests } = req.body;

    if (!guestName || !guestPhone || !checkIn || !checkOut) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide full name, phone number, check-in, and check-out dates.'
      });
    }

    const room = memoryRooms.find(r => r.id === roomId || r._id === roomId) || memoryRooms[0];
    
    // Calculate nights
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)) || 1);
    const totalPrice = nights * (room.price || 220);

    const bookingId = `ST-ERB-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking = {
      bookingId,
      guestName,
      guestPhone,
      guestEmail: guestEmail || 'guest@skytower-erbil.com',
      roomName: room.name,
      roomNameKu: room.nameKu,
      roomNameAr: room.nameAr,
      roomPrice: room.price,
      checkIn,
      checkOut,
      nights,
      guests: guests || 2,
      totalPrice,
      currency: 'USD',
      totalPriceIQD: totalPrice * 1500,
      specialRequests: specialRequests || 'VIP welcome package',
      hotelContact: '07501303137',
      hotelLocation: 'Gulan Street, Erbil, Kurdistan Region',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    bookings.push(newBooking);

    res.status(201).json({
      status: 'success',
      data: {
        booking: newBooking
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
