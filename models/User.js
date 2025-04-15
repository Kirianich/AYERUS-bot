const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  minecraftUuid: { type: String, required: true },

  // Hypixel guild info
  guild: {
    id: { type: String, default: null },
    name: { type: String, default: "None" },
    rank: { type: String, default: "Member" }
  },

  networkRank: { type: String, default: "Default" }, // Hypixel Network Rank
  skyblockLevel: { type: Number, default: 0 },
  skyblockSkills: { type: Object, default: {} }
});

module.exports = mongoose.model('User', UserSchema);
