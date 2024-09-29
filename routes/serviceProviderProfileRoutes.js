const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getProfile, deleteProfile } = require('../controllers/serviceProviderProfileController');
const { authenticateToken } = require('../middlewares/auth');

// Create or update a service provider profile
router.post('/profile/service-provider', authenticateToken, createOrUpdateProfile);

// Get a service provider profile by user ID
router.get('/profile/service-provider/:id', authenticateToken, getProfile);

// Delete a service provider profile by user ID
router.delete('/profile/service-provider/:id', authenticateToken, deleteProfile);

module.exports = router;
