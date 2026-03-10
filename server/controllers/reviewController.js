const Review = require('../models/Review');

// GET /api/reviews/:movieId — Công khai
const getReviews = async (req, res) => {
    try {
        const movieId = parseInt(req.params.movieId, 10);
        const reviews = await Review.find({ movieId }).sort({ createdAt: -1 }).lean();

        const count = reviews.length;
        const averageRating =
            count > 0
                ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
                : null;

        res.json({ reviews, averageRating, count });
    } catch (err) {
        console.error('getReviews error:', err);
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

// POST /api/reviews/:movieId — Cần đăng nhập
const createReview = async (req, res) => {
    try {
        const movieId = parseInt(req.params.movieId, 10);
        const { rating, comment, username } = req.body;
        const userId = req.userId;

        if (!rating || rating < 1 || rating > 10) {
            return res.status(400).json({ msg: 'Đánh giá phải từ 1 đến 10.' });
        }

        // Kiểm tra đã đánh giá chưa
        const existing = await Review.findOne({ movieId, userId });
        if (existing) {
            return res.status(409).json({ msg: 'Bạn đã đánh giá bộ phim này rồi.' });
        }

        const review = await Review.create({
            movieId,
            userId,
            username: username || 'Người dùng',
            rating: Number(rating),
            comment: comment || '',
        });

        res.status(201).json({ review });
    } catch (err) {
        console.error('createReview error:', err);
        if (err.code === 11000) {
            return res.status(409).json({ msg: 'Bạn đã đánh giá bộ phim này rồi.' });
        }
        res.status(500).json({ msg: 'Lỗi server.' });
    }
};

module.exports = { getReviews, createReview };
