const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

router.post('/', auth, employeeController.addEmployee);
router.get('/', auth, employeeController.getAllEmployees);
router.get('/:id', auth, employeeController.getEmployeeById);
router.put('/:id', auth, employeeController.updateEmployee);
router.delete('/:id', auth, employeeController.deleteEmployee);

module.exports = router;