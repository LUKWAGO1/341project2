const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Body parser middleware
app.use(bodyParser.json());

// Session middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// CORS headers setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Passport GitHub Strategy
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, 
function(accessToken, refreshToken, profile, done) {
  // Here you would typically save the user to your database
  // For now, we just return the profile
  return done(null, profile);
}));

// FIXED: Add both serialize and deserialize functions
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Since we're storing the entire user object, just return it
  done(null, user);
});

// Routes
app.use('/', require('./routes/index.js'));

app.get('/', (req, res) => {
  // FIXED: Use req.user instead of req.session.user (Passport sets req.user)
  res.send(req.user !== undefined ? `logged in as ${req.user.displayName}` : 'logged out');
});

// FIXED: Remove session: false and don't manually set req.session.user
app.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    // Successful authentication, redirect home.
    // Passport automatically handles the session via serialize/deserialize
    res.redirect('/');
  });

// Connect to DB then start server
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is connected and Node is running on port ${port}`);
    });
  }
});