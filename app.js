const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./controllers/index');
const usersRouter = require('./controllers/users');
//ref new controllers
const animals = require('./controllers/animals');
const species = require('./controllers/species');
const auth = require('./controllers/auth');
const payment = require('./controllers/payment');

const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: "sandbox", //or live for production
  client_id:'AaIhnaEnDWJW6oU4L2_lh-61JXs1zsKnYf7schGLaat0eLUY488fTvkGMPvPzCK7-EMyHicERO8pOuKe',
  client_secret:'EKWflp01nzE2wr86mhk0gsjMnChMYXda46bMgslpmaChmT-7TymnPOS6TlT_gGEKh_CztHH_HYal33xZ',
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// use dotenv to read .env file with config vars
// if (process.env.NODE_ENV != 'production') {
if ('production' != 'production') {

  require('dotenv').config();
}

//mongoosedb connectioon
const mongoose = require('mongoose');
mongoose
  // .connect(process.env.CONNECTION_STRING)
  .connect('mongodb+srv://zhuxinyu_26:Zxy970124@cluster0.6sozjjl.mongodb.net/stray-animal-rescue')

  .then((res) => {
    console.log('Connected to MongoDB');
  })
  .catch(() => {
    console.log('Connection to MongoDB Failed');
  });

//passport auth config
const passport = require('passport');
const session = require('express-session');

app.use(
  session({
    // secret: process.env.PASSPORT_SECRET,
    secret: 'some-kind-of-string',
    resave: true,
    saveUninitialized: false,
  })
);

// start passport w/session support
app.use(passport.initialize());
app.use(passport.session());

const User = require('./models/user');
passport.use(User.createStrategy());

// read / write session vars
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// google auth strategy for passport
// 1. authenticate google app w/api keys
// 2. check if we already have this user w/this Google id in the users collection
// 3. if user not found, create a new Google user in our users collection
const googleStrategy = require('passport-google-oauth20').Strategy;
passport.use(
  new googleStrategy(
    {
      // clientID: process.env.GOOGLE_CLIENT_ID,
      clientID: '387489748013-mptc6069ru5k2eqgap44hud5j9p5d6pv.apps.googleusercontent.com',
      // clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      clientSecret: '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',
      // callbackURL: process.env.GOOGLE_CALLBACK_URL,
      callbackURL: 'https://stray-animal-rescue.onrender.com/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOrCreate(
        { oauthId: profile.id },
        {
          username: profile.displayName,
          oauthProvider: 'Google',
        },
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);

// github auth strategy for passport
// 1. authenticate github app w/api keys
// 2. check if we already have this user w/this github id in the users collection
// 3. if user not found, create a new github user in our users collection
const GitHubStrategy = require('passport-github').Strategy;
passport.use(
  new GitHubStrategy(
    {
      // clientID: process.env.GITHUB_CLIENT_ID,
      clientID: '9c9844a96d5bdbea1ee5',
      // clientSecret: process.env.GITHUB_CLIENT_SECRET,
      clientSecret: 'd76791c1ff9bf0df1314075a6aab1fe72dff0aa2',
      // callbackURL: process.env.GITHUB_CALLBACK_URL,
      callbackURL: 'https://stray-animal-rescue.onrender.com/auth/github/callback',

    },
    (accessToken, refreshToken, profile, done) => {
      User.findOrCreate(
        { githubId: profile.id },
        {
          username: profile.displayName,
          oauthProvider: 'GitHub',
        },
        (err, user) => {
          return done(err, user);
        }
      );
    }
  )
);
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
//map
app.use('/animals', animals);
app.use('/species', species);
app.use('/auth', auth);
app.use('/payment', payment);
// add hbs extension function to select the correct dropdown option when editing
const hbs = require('hbs');
hbs.registerHelper('selectOption', (currentValue, selectedValue) => {
  let selectedProperty = '';
  if (currentValue == selectedValue) {
    selectedProperty = ' selected';
  }
  return new hbs.SafeString(
    `<option${selectedProperty}>${currentValue}</option>`
  );
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
