// middlewares/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secretKey = process.env.secretKey;


// Middleware สำหรับตรวจสอบการรับรองตัวตน
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ error: 'การรับรองตัวตนไม่ถูกต้อง' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'การรับรองตัวตนไม่ถูกต้อง' });
    }
    req.user = decoded;
    next();
  });
  
};

module.exports = authMiddleware;
