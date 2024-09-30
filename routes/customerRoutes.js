// routes/customerRoutes.js
const express = require('express');
const { getAllCustomerProfiles } = require('../controllers/customerController');
const router = express.Router();

// GET /api/customer-profiles
router.get('/customer-profiles', getAllCustomerProfiles);

module.exports = router;
