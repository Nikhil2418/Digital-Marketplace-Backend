const express = require('express');
const router = express.Router();
const { createApplication, getApplications, getProviderApplications, getUserApplications, deleteApplication, updateApplicationStatus, updatePaymentStatus } = require('../controllers/applicationController');
const { authenticateToken } = require('../middlewares/auth');

// Create a new application for a service
router.post('/applications', authenticateToken, createApplication);

// Retrieve all applications (for testing or admin panel)
router.get('/applications', authenticateToken, getApplications);

router.get('/applications/provider', authenticateToken, getProviderApplications);

// Get all applications for a specific user
router.get('/applications/user/:userId', authenticateToken, getUserApplications);

// Delete an application by ID
router.delete('/applications/:applicationId', authenticateToken, deleteApplication);

// PUT /api/applications/:applicationId/status - Update application status
router.put('/applications/:applicationId/status', authenticateToken, updateApplicationStatus);

// PUT /api/applications/:applicationId/payment-status - Update payment status
router.put('/applications/:applicationId/payment-status', authenticateToken, updatePaymentStatus);

module.exports = router;
