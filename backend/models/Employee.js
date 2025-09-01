const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    position: { type: String, required: true },
    department: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String }, // Stores the file path or URL of the uploaded image
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);