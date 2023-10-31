const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const User = require('../models/User');
const dayjs = require('dayjs'); // หรือใช้ require('moment');
const multer = require('multer'); // Import multer library

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    // Set the filename for the uploaded file (you can customize this)
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// POST /checkin/insert - สำหรับบันทึก Checkin
router.post('/', upload.single('image'), async (req, res, next) => {
  const { userId, time, location } = req.body;

  try {
    if (!userId || !time || !location) {
      return res.status(400).json({ error: 'กรุณาระบุข้อมูลครบถ้วน' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User ไม่พบในระบบ' });
    }

    const parsedTime = dayjs(time);

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

    const imagePath = 'images/' + req.file.filename;

    const checkin = new Checkin({
      userId: user._id,
      time: parsedTime.toDate(),
      image: imagePath,
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