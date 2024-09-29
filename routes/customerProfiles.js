const express = require('express');
const router = express.Router();
const customerProfileController = require('../controllers/customerProfileController');
const { authenticateToken } = require('../middlewares/auth'); // Middleware to authenticate the user

// Create a new Customer Profile
router.post('/', authenticateToken, customerProfileController.createCustomerProfile);

// Get a Customer Profile by ID
router.get('/:id', authenticateToken, customerProfileController.getCustomerProfile);

// Update a Customer Profile by ID
router.put('/:id', authenticateToken, customerProfileController.updateCustomerProfile);

// Delete a Customer Profile by ID
router.delete('/:id', authenticateToken, customerProfileController.deleteCustomerProfile);

module.exports = router;
