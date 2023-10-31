const express = require('express');
const router = express.Router();
const multer = require('multer'); // ใช้ multer เพื่อจัดการอัปโหลดไฟล์

// กำหนดตำแหน่งที่จะบันทึกไฟล์
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
  cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
  cb(null, Date.now() + ".png")
  }
  })
  const upload = multer({ storage: storage })
  app.get('/', (req, res) => {
  res.send('Hello Upload')
  })
  app.post('/upload', upload.single('file'),  (req, res) => { 
      if (req.file) {
          const imageUrl = req.file.filename;
          res.status(200).json({ status: 'success', message: 'Image uploaded', imageUrl });
        } else {
      
          res.status(400).json({ status: 'error', message: 'No file uploaded' });
        }
  })