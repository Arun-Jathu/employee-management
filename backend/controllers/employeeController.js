const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only .jpg, .jpeg, .png files are allowed!'));
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Add new employee
exports.addEmployee = [
    upload.single('image'), // Handle single image upload
    async (req, res) => {
        try {
            const { fullName, position, department, email } = req.body;
            const image = req.file ? req.file.path : null;

            const employee = new Employee({
                fullName,
                position,
                department,
                email,
                image,
            });

            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
];

// Get all employees (with optional department filter)
exports.getAllEmployees = async (req, res) => {
    try {
        const { department } = req.query;
        const query = department ? { department } : {};
        const employees = await Employee.find(query);
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single employee by ID
exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(employee);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update employee
exports.updateEmployee = [
    upload.single('image'),
    async (req, res) => {
        try {
            const { fullName, position, department, email } = req.body;
            const image = req.file ? req.file.path : undefined;

            const updateData = { fullName, position, department, email };
            if (image) updateData.image = image;

            const employee = await Employee.findByIdAndUpdate(
                req.params.id,
                updateData,
                { new: true, runValidators: true }
            );
            if (!employee) {
                return res.status(404).json({ error: 'Employee not found' });
            }
            res.json(employee);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
];

// Delete employee
exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};