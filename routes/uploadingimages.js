const express = require('express');
const router = express.Router();
const multer = require('multer'); // ใช้ multer เพื่อจัดการอัปโหลดไฟล์

// กำหนดตำแหน่งที่จะบันทึกไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // บันทึกไฟล์ในโฟลเดอร์ uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // กำหนดชื่อไฟล์ที่จะถูกบันทึก
  },
});

// กำหนดการอัปโหลดโดยใช้ multer
const upload = multer({ storage: storage });

// เส้นทางสำหรับการอัปโหลดภาพ
router.post('/', upload.single('image'), (req, res) => {
  if (req.file) {
    // ไฟล์ถูกอัปโหลดสำเร็จ
    const imageUrl = req.file.filename;
    res.status(200).json({ status: 'success', message: 'Image uploaded', imageUrl });
  } else {
    // ไม่มีไฟล์ถูกอัปโหลด
    res.status(400).json({ status: 'error', message: 'No file uploaded' });
  }
});

module.exports = router;