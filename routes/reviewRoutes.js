const express = require('express');
const { addReview } = require('../controllers/reviewController');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

// POST /api/reviews/:profileType/:profileId
// Example: POST /api/reviews/customer/:profileId or /api/reviews/service-provider/:profileId
router.post('/:profileType/:profileId', authenticateToken, addReview);

module.exports = router;
