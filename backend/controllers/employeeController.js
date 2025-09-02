const Employee = require('../models/employee');
const multer = require('multer');
const path = require('path');

// Configure Multer storage for file uploads (Here for profile photo uploadaing)
// Specifies where and how to save uploaded profile photos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    // Using timestamp and original name to generate unique filenames for eac uploads
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// Configure Multer middleware for handling image uploads 
// Initializing validation mechanism for allowed file type and maximum size
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Allowing jpeg, jpg, png formats only
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true); // Accept valid file
        } else {
            cb(new Error('Only .jpg, .jpeg, .png files are allowed!'));
        }
    },
    // Setting image size limit ipto 5MB
    limits: { fileSize: 5 * 1024 * 1024 }, 
});

/**
 * Add a new employee
 */

exports.addEmployee = [
    upload.single('image'), // Handle single image upload
    async (req, res) => {
        try {
            // Extract employee data from request body and get image path if uploaded or null
            const { fullName, position, department, email } = req.body;
            const image = req.file ? req.file.path : null;
            
            // Create new employee instance
            const employee = new Employee({
                fullName,
                position,
                department,
                email,
                image,
            });

            // Save employee details to MongoDB database and returning status
            await employee.save();
            res.status(201).json(employee);
        } catch (error) {
            // returning error status
            res.status(400).json({ error: error.message });
        }
    },
];

/**
 * Department wise filter functionality
 */
exports.getAllEmployees = async (req, res) => {
    try {
        // Get department filter from query parameters
        const { department } = req.query;
        // Build query: filter by department if provided, else return all
        const query = department ? { department } : {};
        // Fetch employees from MongoDB
        const employees = await Employee.find(query);
        // Respond with employee list
        res.json(employees);
    } catch (error) {
        // Handle database or server errors
        res.status(500).json({ error: error.message });
    }
};


/**
 *  Get single employee by ID
 */

exports.getEmployeeById = async (req, res) => {
    try {
        // Find employee by ID
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            // Return 404 if employee doesn't exist
            return res.status(404).json({ error: 'Employee not found' });
        }
        // Respond with employee data
        res.json(employee);
    } catch (error) {
        // Handle invalid ID or server errors
        res.status(500).json({ error: error.message });
    }
};

/**
 * Update an existing employee by ID
 */

exports.updateEmployee = [
  upload.single('image'), // Handle single image upload
  async (req, res) => {
    try {
      // Extract updated data from request body
      const { fullName, position, department, email } = req.body;
      // Get image path if uploaded, else undefined
      const image = req.file ? req.file.path : undefined;

      // Prepare update data, including image only if provided
      const updateData = { fullName, position, department, email };
      if (image) updateData.image = image;

      // Update employee in MongoDB
      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true } // Return updated document, run schema validators
      );
      if (!employee) {
        // Return status (404)
        return res.status(404).json({ error: 'Employee not found' });
      }
      // Respond status (successwith updated employee)
      res.json(employee);
    } catch (error) {
      // Handling validation or database errors
      res.status(400).json({ error: error.message });
    }
  },
];

/**
 * Delete an employee by ID
 */

exports.deleteEmployee = async (req, res) => {
  try {
    // Delete employee by ID
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
    // Return status (404)
      return res.status(404).json({ error: 'Employee not found' });
    }
    // Respond status (success)
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    // Handling invalid ID or server errors
    res.status(500).json({ error: error.message });
  }
};