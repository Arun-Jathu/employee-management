const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employees');
const userRoutes = require('./routes/userRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();
const PORT = process.env.PORT || 5000; // Default to port 5000 if PORT env variable is not set

// Middleware
// Enable CORS for cross-origin requests from frontend
app.use(cors());
// Parse JSON request bodies with 10MB limit
app.use(bodyParser.json({ limit: '10mb' }));
// Parse URL-encoded request bodies with 10MB limit
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
// Serve static files from 'Uploads' directory for employee images
app.use('/uploads', express.static('Uploads'));

// MongoDB Connection
// Connect to MongoDB using URI from environment variables
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected')) // Log successful connection
  .catch(err => console.error('MongoDB connection error:', err)); // Log connection errors

// Routes
// Mount employee-related routes under /api/employees
app.use('/api/employees', employeeRoutes);
// Mount user authentication routes under /api/users
app.use('/api/users', userRoutes);

/**
 * Start the Express server
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});