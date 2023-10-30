// routes/checkin.js
const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const User = require('../models/User'); // สมมติว่าคุณมีโมเดล User สำหรับผู้ใช้

// POST /checkin/insert - สำหรับบันทึก Checkin
router.post('/', async (req, res, next) => {
  const { time, image, location } = req.body;

  try {
    if (!req.body.userId) {
      return res.status(400).json({ error: 'กรุณาระบุ userId' });
    }

    // ดึงข้อมูล User จากฐานข้อมูล
    const user = await User.findById(req.body.userId);

    if (!user) {
      return res.status(404).json({ error: 'User ไม่พบในระบบ' });
    }

    // สร้าง Checkin โดยใช้ข้อมูล userId ที่ดึงมาจากฐานข้อมูล
    const checkin = new Checkin({
      userId: user._id, // ใช้ _id ของ User
      time,
      image,
      location: {
        type: 'Point',
        coordinates: location,
      },
    });

    const savedCheckin = await checkin.save();
    res.status(201).json(savedCheckin);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึก Checkin' });
  }
});

module.exports = router;
