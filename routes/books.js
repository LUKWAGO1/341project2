// ===== routes/books.js =====
const express = require('express');
const router = express.Router();
const db = require('../data/database');  // Import db directly
const Book = require('../models/Book');

// Update middleware to use db.checkConnection
router.use(async (req, res, next) => {
  try {
    await db.checkConnection();  // Use db.checkConnection instead of Book.checkConnection
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

router.get('/', async (req, res) => {
  try {
    console.log('Database query starting...');
    console.log('Query parameters:', req.query);
    
    const books = await Book.findAll();
    console.log('Query SQL:', Book.lastQuery); // Add this to your Book model
    console.log('Raw database response:', books);
    
    if (!books) {
      return res.status(500).json({ 
        success: false, 
        message: 'Database query failed' 
      });
    }
    
    if (books.length === 0) {
      return res.json({ 
        success: true, 
        data: [],
        message: 'No books found in database. Please add some books first.' 
      });
    }
    
    res.json({ success: true, data: books });
  } catch (error) {
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code
    });
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: 'Database query failed',
      code: error.code
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    console.log('Fetching book with ID:', req.params.id);
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, data: book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    console.log('Attempting to create book with data:', req.body);
    
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Book title is required'
      });
    }
    
    const newBook = await Book.create(req.body);
    console.log('Created book:', newBook);
    
    // Verify the book was created by fetching it
    const verifyBook = await Book.findById(newBook.id);
    console.log('Verification fetch:', verifyBook);
    
    if (!verifyBook) {
      throw new Error('Book creation failed - verification returned null');
    }
    
    res.status(201).json({ 
      success: true, 
      data: newBook,
      message: 'Book created successfully'
    });
  } catch (error) {
    console.error('Book creation error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: 'Failed to create book'
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('Updating book:', req.params.id);
    const updatedBook = await Book.update(req.params.id, req.body);
    if (!updatedBook.matchedCount) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book updated successfully' });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log('Deleting book:', req.params.id);
    const deletedBook = await Book.delete(req.params.id);
    if (!deletedBook.deletedCount) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    res.json({ success: true, message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;