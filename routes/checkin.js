// routes/checkin.js
const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const User = require('../models/User');
const dayjs = require('dayjs'); // หรือใช้ require('moment');

// POST /checkin/insert - สำหรับบันทึก Checkin
router.post('/', async (req, res, next) => {
  const { userId, time, image, location } = req.body;

  try {
    if (!userId || !time || !image || !location) {
      return res.status(400).json({ error: 'กรุณาระบุข้อมูลครบถ้วน' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User ไม่พบในระบบ' });
    }

    // แปลงค่า `time` เป็นรูปแบบ ISO 8601 ด้วย dayjs หรือ moment
    const parsedTime = dayjs(time); // หรือ moment(time)

    if (!parsedTime.isValid()) {
      return res.status(400).json({ error: 'ข้อมูลเวลาไม่ถูกต้อง' });
    }

    if (
      !Array.isArray(location) ||
      location.length !== 2 ||
      typeof location[0] !== 'number' ||
      typeof location[1] !== 'number'
    ) {
      return res.status(400).json({ error: 'ข้อมูล location ไม่ถูกต้อง' });
    }

    const checkin = new Checkin({
      userId: user._id,
      time: parsedTime.toDate(), // ใช้ค่าที่แปลงแล้ว
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