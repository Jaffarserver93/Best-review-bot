const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    review: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    timestamp: { type: Date, default: Date.now },
    reviewId: { type: String, required: true, unique: true }, // Unique review ID
    usefulCount: { type: Number, default: 0 }, // Counter for "useful" button
    usefulUsers: [{ type: String }], // Track users who clicked "useful" to prevent duplicates
});

module.exports = mongoose.model('Review', reviewSchema);
