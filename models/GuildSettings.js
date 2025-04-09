const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    verifiedRole: { type: String, default: null },
    unverifiedRole: { type: String, default: null },
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);
