// models/Checkin.js
const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // อ้างอิงไปยังโมเดล User (ถ้ามี)
  },
  time: Date,
  image: String,
  location: {
    type: { type: String },
    coordinates: [Number],
  },
});

// กำหนดดัชนีสำหรับตำแหน่ง
checkinSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Checkin', checkinSchema);
