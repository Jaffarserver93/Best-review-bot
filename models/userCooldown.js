const mongoose = require('mongoose');

const userCooldownSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  lastReviewTimestamp: { type: Date, default: null },
});

// Add compound index on userId and guildId for faster queries
userCooldownSchema.index({ userId: 1, guildId: 1 }, { unique: true });

module.exports = mongoose.model('UserCooldown', userCooldownSchema);
