const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  cuisineType: [String],
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
  },
  contact: {
    phone: String,
    email: String,
  },
  openingHours: {
    open: String,
    close: String,
  },
  images: [String],
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  rejectionReason: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);