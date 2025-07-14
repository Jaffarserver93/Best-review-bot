const mongoose = require('mongoose');

const guildSettingsSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  reviewChannelId: { type: String }, // Optional, set via /setreview
});

module.exports = mongoose.model('GuildSettings', guildSettingsSchema);
