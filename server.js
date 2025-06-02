const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { initDb } = require('./data/database'); // Updated import
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors()); // You can also configure this with origin if needed

app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.use('/', require('./routes/index.js'));

app.get('/', (req, res) => {
  res.send(req.user ? `Logged in as ${req.user.displayName}` : 'Logged out');
});

app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    res.redirect('/');
  }
);

// ✅ Connect to database and then start the server
initDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Database connected. Server running on port ${port}`);
    });
  })