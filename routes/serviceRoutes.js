const express = require('express');
const { authenticateToken, isServiceProvider } = require('../middlewares/auth');
const router = express.Router();

// Import controller functions
const {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
    updateServiceStatus,
    markAsPaid
} = require('../controllers/serviceController');

// Route to create a new service (Only accessible to service providers)
router.post('/create', authenticateToken, isServiceProvider, createService);

// Route to get all services (open for both customers and service-providers)
router.get('/provider', authenticateToken, getAllServices);

// Route to get a single service by ID
router.get('/:id', authenticateToken, getServiceById);

// Route to update a service (Only accessible to service providers)
router.put('/:id', authenticateToken, isServiceProvider, updateService);

// Route to delete a service (Only accessible to service providers)
router.delete('/services/:id', authenticateToken, isServiceProvider, deleteService);

// Customer: Update service status
router.post('/services/status', authenticateToken, updateServiceStatus);

// Provider: Mark service as paid
router.post('/services/mark-paid', authenticateToken, markAsPaid);

module.exports = router;
