// ===== routes/authors.js =====
const express = require('express');
const router = express.Router();
const db = require('../data/database');  // Import db directly
const Author = require('../models/Author');
const authorControllers = require('../controllers/authorControllers');

// Connection check middleware
router.use(async (req, res, next) => {
  try {
    await db.checkConnection();  // Use db.checkConnection instead of Author.checkConnection
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

router.get('/', authorControllers.getAllAuthors);
router.get('/:id', authorControllers.getAuthorById);
router.post('/', authorControllers.createAuthor);
router.put('/:id', authorControllers.updateAuthor);
router.delete('/:id', authorControllers.deleteAuthor);

module.exports = router;
