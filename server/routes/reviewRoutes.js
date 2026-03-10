const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { getReviews, createReview } = require('../controllers/reviewController');

// GET /api/reviews/:movieId — công khai
router.get('/:movieId', getReviews);

// POST /api/reviews/:movieId — cần đăng nhập
router.post('/:movieId', protect, createReview);

module.exports = router;
