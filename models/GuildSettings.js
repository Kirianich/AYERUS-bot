const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    verifiedRole: { type: String }
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);
