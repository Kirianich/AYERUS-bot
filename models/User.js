 const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    discordId: String,
    minecraftUUID: String,
    ign: String,
    guildId: String
});

module.exports = mongoose.model('User', userSchema);
