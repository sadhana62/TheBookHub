const express = require('express');
const { body, validationResult } = require('express-validator');
const Book = require('../models/Book');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all books
// @route   GET /api/books
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, trending, limit = 10, page = 1 } = req.query;
    
    // Build query
    let query = {};
    
    if (category && category !== 'Choose a genre') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (trending === 'true') {
      query.trending = true;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const books = await Book.find(query)
      .populate('createdBy', 'name')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Book.countDocuments(query);

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: books
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('createdBy', 'name');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new book
// @route   POST /api/books
// @access  Private (Admin only)
router.post('/', [
  protect,
  authorize('admin'),
  body('title').notEmpty().withMessage('Title is required'),
  body('author').notEmpty().withMessage('Author is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('new_price').isNumeric().withMessage('New price must be a number'),
  body('old_price').isNumeric().withMessage('Old price must be a number')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    req.body.createdBy = req.user.id;
    const book = await Book.create(req.body);

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (Admin only)
router.put('/:id', [
  protect,
  authorize('admin')
], async (req, res) => {
  try {
    let book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (Admin only)
router.delete('/:id', [
  protect,
  authorize('admin')
], async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 