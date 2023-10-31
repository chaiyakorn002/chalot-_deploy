const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const User = require('../models/User');
const dayjs = require('dayjs'); // หรือใช้ require('moment');
const multer = require('multer');
const fs = require('fs');

// กำหนดตำแหน่งที่รูปภาพจะถูกบันทึก
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // ระบุเส้นทางเก็บรูปภาพ
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // กำหนดชื่อไฟล์ใหม่
  },
});

const upload = multer({ storage: storage });

// POST /checkin - สำหรับบันทึก Checkin
router.post('/', upload.single('image'), async (req, res, next) => {
  const { userId, time, location } = req.body;
  const imageBase64 = req.body.image; // รับข้อมูลรูปภาพในรูปแบบ Base64

  // ตรวจสอบค่า userId, time, location

  try {
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

    // แปลง Base64 เป็น buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    const imageFilename = Date.now() + '.jpg'; // สร้างชื่อไฟล์
    const imagePath = `public/images/${imageFilename}`; // เส้นทางไฟล์รูปภาพ

    // บันทึกรูปภาพในเซิร์ฟเวอร์
    fs.writeFileSync(imagePath, imageBuffer);

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