const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

// Configure Express router for employee-related API endpoints
// Applies authentication middleware to all routes

/**
 * Create a new employee
 */
router.post('/', auth, employeeController.addEmployee);

/**
 * Retrieve all employees, optionally filtered by department
 */
router.get('/', auth, employeeController.getAllEmployees);

/**
 * Retrieve a single employee by ID
 */
router.get('/:id', auth, employeeController.getEmployeeById);

/**
 *  Update an existing employee by ID
 */
router.put('/:id', auth, employeeController.updateEmployee);

/**
 *  Delete an employee by ID
 */
router.delete('/:id', auth, employeeController.deleteEmployee);

// Export router for use in main server
module.exports = router;