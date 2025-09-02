const mongoose = require('mongoose');
// Define Employee schema for MongoDB
// Represents employee data structure with required fields and timestamps

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String }, 
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

// Export Employee model for use in controllers
module.exports = mongoose.model('Employee', employeeSchema);