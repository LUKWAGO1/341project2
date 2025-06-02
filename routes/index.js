const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
  //#swagger.tags = ['Hello World']
  if (req.session.user) {
    res.send(`Hello ${req.session.user.displayName || req.session.user.username || 'User'}! <a href="/logout">Logout</a>`);
  } else {
    res.send('You are logged out. <a href="/login">Login with GitHub</a>');
  }
});

router.use('/books', require('./books'));
router.use('/authors', require('./authors'));

// Start GitHub OAuth login
router.get('/login', passport.authenticate('github'));

// GitHub OAuth callback (this was missing)
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/' }),
  function(req, res) {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// Logout
router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    req.session.user = undefined;
    res.redirect('/');
  });
});

module.exports = router;