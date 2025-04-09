const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    discordId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    hypixelUuid: {type: String, required: true },
    guildId: { type: String, required: true }, //Discord Server
    hypixelGuild: { type: String, default: "None" }, // Hypixel Guild Name
    hypixelGuildRank: { type: String, default: "Member" }, // Rank inside the Hypixel Guild
    hypixelRank: { type: String, default: "Default" }, // Hypixel Rank
    skyblockLevel: { type: Number, default: 0 }, // Skyblock Level
    skyblockSkills: { type: Object, default: {} } // Skyblock Skill Levels
});

module.exports = mongoose.model('User', UserSchema);
