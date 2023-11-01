const express = require("express");
const multer = require("multer");
const router = express.Router();
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".png");
  },
})

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  if (req.file) {
    const imageUrl = req.file.filename;
    res
      .status(200)
      .json({ status: "success", message: "Image uploaded", imageUrl });
  } else {
    res.status(400).json({ status: "error", message: "No file uploaded" });
  }
});

router.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname,'..','uploads',filename);

  // ส่งไฟล์รูปภาพกลับไปยังผู้ใช้
  res.sendFile(filePath);
});


module.exports = router;
