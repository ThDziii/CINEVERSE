const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        movieId: {
            type: Number,
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        username: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 10,
        },
        comment: {
            type: String,
            maxlength: 1000,
            default: '',
        },
    },
    { timestamps: true }
);

// Mỗi người dùng chỉ đánh giá một lần cho một bộ phim
reviewSchema.index({ movieId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
