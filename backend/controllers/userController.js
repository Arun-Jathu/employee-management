const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Configure dependencies for user authentication
// Imports User model, JWT for token generation, and express-validator for input validation

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  // Validate request body using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return first validation error if any
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  // Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Check if user already exists by email
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user instance
    user = new User({ email, password });
    // Save user to MongoDB (password is hashed via User model pre-save hook)
    await user.save();

    // Generate JWT token with user ID
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret', // Fallback secret if env variable is missing
      { expiresIn: '1d' } // Token expires in 1 day
    );

    // Respond with JWT token
    res.status(201).json({ token });
  } catch (error) {
    // Log and handle server errors (e.g., database issues)
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

/**
 * Login an existing user
 */
exports.login = async (req, res) => {
  // Validate request body using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return first validation error if any
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  // Extract email and password from request body
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Return error if user doesn't exist
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with stored hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Return error if password doesn't match
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token with user ID
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your_jwt_secret', // Fallback secret if env variable is missing
      { expiresIn: '1d' } // Setting duration of password to 1 day
    );

    // Respond with JWT token
    res.json({ token });
  } catch (error) {
    // Log and handle server errors 
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};