const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/userController');
const { body } = require('express-validator');

// Configure Express router for user authentication API endpoints
// Includes input validation for registration and login

/**
 *  Register a new user with email and password
 */
router.post(
  '/register',
  [
    // Validate email format
    body('email').isEmail().withMessage('Please enter a valid email'),
    // Ensure password is at least 6 characters
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  register
);

/**
 *  Authenticate a user and return a JWT token
 */
router.post(
  '/login',
  [
    // Validate email format
    body('email').isEmail().withMessage('Please enter a valid email'),
    // Ensure password is provided
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

// Export router for use in main server
module.exports = router;