const jwt = require('jsonwebtoken');

function isAuthenticated(req, res, next) {
  // Check for session user
  if (req.session && req.session.user) {
    return next();
  }
  // Check for Bearer token
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET || 'your-secret-key-here');
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }
  return res.status(401).json({ error: 'Authentication required', message: 'You do not have access. Please authenticate via /login' });
}

module.exports = { isAuthenticated };