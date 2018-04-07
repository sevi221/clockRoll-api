const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const corsConfig = require('./configs/cors.config');
const dotenv = require('dotenv');

require('./configs/db.config');
require('./configs/passport.config').setup(passport);

const alarmRoutes = require('./routes/alarm.routes');
const usersRoutes = require('./routes/users.routes');
const sessionRoutes = require('./routes/session.routes');

const app = express();


//MIDDLEWARES
app.use(cors(corsConfig))

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'Super Secret',
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 2419200000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.session = req.user || {};
  next();
});
// console.log(req.url)
// Routes
app.use('/alarm', alarmRoutes);
app.use('/users', usersRoutes);
app.use('/session', sessionRoutes);

// catch 404 and forward to error handler
app.use((req, res, next)  => {
  const error = new Error('Not Found');

  error.status = 404;
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({ message: error.message || '' });
});

module.exports = app;
