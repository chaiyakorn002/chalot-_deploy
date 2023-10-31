var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const products = require('./routes/products');
const loginRouter = require('./routes/login');
const checkinRouter = require('./routes/checkin'); // เรียกใช้เส้นทาง Checkin
const cors = require('cors')
require('dotenv').config()
const uri = process.env.MONGO_URI

mongoose.Promise = global.Promise;

mongoose.connect(uri)
        .then(() => console.log('connection successfully!'))
        .catch((err) => console.error(err))

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', products);
app.use('/login', loginRouter);
app.use('/checkin', checkinRouter); // เรียกใช้เส้นทาง API Checkin

app.get('/images/:imageId', async (req, res) => {
  const imageId = req.params.imageId;

  try {
    const checkin = await Checkin.findById(imageId);

    if (!checkin) {
      return res.status(404).json({ error: 'ไม่พบรูปภาพ' });
    }

    // ส่งรูปภาพกลับไปให้ผู้ใช้
    res.sendFile(checkin.image);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการแสดงรูปภาพ' });
  }
});


app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//311023