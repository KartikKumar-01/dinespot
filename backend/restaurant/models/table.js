// models/Table.js
const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  tableNumber: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, enum: ['indoor', 'outdoor', 'balcony'], default: 'indoor' },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Table', tableSchema);