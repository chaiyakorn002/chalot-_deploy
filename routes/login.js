const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to handle user login
router.post('/', async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        // ตรวจสอบ username จากฐานข้อมูล
        const user = await User.findOne({ username: username });

        if (!user) {
            res.status(401).json({ message: 'Invalid username' });
            return;
        }

        if (user.password !== password) {
            res.status(401).json({ message: 'Invalid password' });
        } else {
            res.json({ message: 'Login Successful', userId: user._id });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
