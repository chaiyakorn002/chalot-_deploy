const express = require('express');
const router = express.Router();
const Checkin = require('../models/Checkin');
const User = require('../models/User');
const dayjs = require('dayjs'); // หรือใช้ require('moment');
const fs = require('fs');
const path = require('path');

// สร้างฟังก์ชันเพื่อบันทึกรูปภาพและสร้าง URL
function saveImage(base64Image) {
  const imageName = 'image_' + Date.now() + '.png';
  const imagePath = path.join(__dirname, 'images', imageName); // ให้แก้ไขตำแหน่งที่บันทึกไฟล์ตามที่คุณต้องการ

  const base64Data = base64Image.replace(/^data:image\/png;base64,/, '');

  fs.writeFileSync(imagePath, base64Data, 'base64');

  const imageUrl = '/images/' + imageName; // ตั้งค่าตามที่คุณบันทึกไฟล์

  return imageUrl;
}

// POST /checkin - สำหรับบันทึก Checkin
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

    const imageUrl = saveImage(image);

    const checkin = new Checkin({
      userId: user._id,
      time: parsedTime.toDate(),
      image: imageUrl, // ใช้ URL แทน Base64
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