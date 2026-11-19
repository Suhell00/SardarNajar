/**
 * Sky Tower Erbil - Room Model
 * Simple Mongoose Schema following Jonas Schmedtmann's bootcamp guidelines
 */

import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A room must have a name'],
      unique: true,
      trim: true
    },
    nameKu: {
      type: String,
      trim: true
    },
    nameAr: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'A room must have a price']
    },
    ratingsAverage: {
      type: Number,
      default: 4.8,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    roomType: {
      type: String,
      required: [true, 'A room must have a roomType'],
      enum: {
        values: ['deluxe', 'panoramic', 'presidential', 'executive', 'penthouse'],
        message: 'Room type must be deluxe, panoramic, presidential, executive, or penthouse'
      }
    },
    capacity: {
      type: Number,
      required: [true, 'A room must have a guest capacity']
    },
    beds: {
      type: Number,
      default: 1
    },
    baths: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      required: [true, 'A room must have a size in square meters']
    },
    badge: {
      type: String,
      default: 'Featured'
    },
    badgeKu: {
      type: String,
      default: 'تایبەت'
    },
    badgeAr: {
      type: String,
      default: 'مميز'
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A room must have a summary']
    },
    summaryKu: {
      type: String,
      trim: true
    },
    summaryAr: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    descriptionKu: {
      type: String,
      trim: true
    },
    descriptionAr: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A room must have a cover image']
    },
    images: [String],
    amenities: [String],
    amenitiesKu: [String],
    amenitiesAr: [String],
    isFeatured: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property for price in Iraqi Dinar (IQD approx. 1,500 IQD per USD)
roomSchema.virtual('priceIQD').get(function () {
  return this.price * 1500;
});

const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

export default Room;
