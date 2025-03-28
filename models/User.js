const mongoose = require('mongoose');

const VerifiedUserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    guildId: { type: String, required: true }
});

module.exports = mongoose.model('VerifiedUser', VerifiedUserSchema);
