const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User schema for MongoDB
// Represents user credentials with email, password, and password hashing

const userSchema = new mongoose.Schema({
  // Email address, required, unique, trimmed, lowercase, and validated
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email'],
  },
  // Password, required, minimum length of 6 characters
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
});

/**
 * Pre-save middleware to hash password before saving
 */
userSchema.pre('save', async function (next) {
  // Only hash password if it was modified
  if (this.isModified('password')) {
    // Hash password with bcrypt using 10 salt rounds
    this.password = await bcrypt.hash(this.password, 10);
  }
  // Proceed to next middleware or save
  next();
});

/**
 * Compare provided password with stored hash
 */
userSchema.methods.comparePassword = async function (password) {
  // Use bcrypt to compare plaintext password with hashed password
  return await bcrypt.compare(password, this.password);
};

// Export User model for use in authentication controllers
module.exports = mongoose.model('User', userSchema);