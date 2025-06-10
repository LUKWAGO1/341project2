const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { initDb } = require('./data/database'); // Make sure path is correct
const passport = require('passport');
const session = require('express-session');
const GithubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-here',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

// Dynamic callback URL based on environment
const getCallbackUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://three41project2.onrender.com/auth/github/callback';
  } else {
    return 'http://localhost:3000/auth/github/callback';
  }
};

// GitHub OAuth Strategy
passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: getCallbackUrl(), // Use dynamic callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('GitHub OAuth successful for user:', profile.username);
      return done(null, profile);
    }
  )
);

// Serialize/Deserialize User
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Routes
app.use('/', require('./routes/index.js'));

// Initialize DB and start server (using callback)
initDb((err, db) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err);
    process.exit(1); // Exit if DB connection fails
  }

  app.listen(port, () => {
    console.log(`✅ Database connected. Server running on port ${port}`);
    console.log(`📝 API Docs: http://localhost:${port}/api-docs`);
    console.log(`🔐 GitHub OAuth URL: ${getCallbackUrl()}`);
  });
});

// Remove the duplicate initDb section below - you have it twice
// Keep only the one above