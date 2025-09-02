const jwt = require('jsonwebtoken');

// Configure JWT dependency for token verification

/**
 * Middleware to authenticate requests using JWT
 */
module.exports = async (req, res, next) => {
  // Extract token from Authorization header, removing 'Bearer ' prefix
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    // Attach decoded payload (e.g., userId) to request object
    req.user = decoded;
    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Handle invalid or expired token
    res.status(401).json({ error: 'Invalid token' });
  }
};