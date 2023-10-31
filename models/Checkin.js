// models/Checkin.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const checkinSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, ref: 'User' }, // เชื่อมกับโครงสร้างข้อมูล User
  time: { type: Date, required: true },
  image: { type: String, required: true }, // เก็บ URL ของรูปภาพ
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: { type: [Number], required: true },
  },
});

checkinSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Checkin', checkinSchema);
