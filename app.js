var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const products = require('./routes/products');
const loginRouter = require('./routes/login');
const cors = require('cors');
require('dotenv').config();
const uri = process.env.MONGO_URI;

mongoose.Promise = global.Promise;

mongoose.connect(uri)
        .then(() => console.log('connection successfully!'))
        .catch((err) => console.error(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const multer = require('multer');
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', products);
app.use('/login', loginRouter);
app.use('/checkin', checkinRouter); // เรียกใช้เส้นทาง API Checkin

// Include the /upload route and Multer middleware
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + ".png");
  }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (req.file) {
    const imageUrl = req.file.filename;
    res.status(200).json({ status: 'success', message: 'Image uploaded', imageUrl });
  } else {
    res.status(400).json({ status: 'error', message: 'No file uploaded' });
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;