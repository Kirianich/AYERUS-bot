const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    discordGuildId: { type: String, required: true, unique: true },
    verifiedRole: { type: String, default: null },
    unverifiedRole: { type: String, default: null },
    guestRole: { type: String, default: null }, // Applies if user is NOT in any linked guild
    nicknameFormat: { type: String, default: '{username}' },
    ignoredRoles: [String],

    
    linkedGuilds: [
    {
      hypixelGuildId: String,
      hypixelGuildName: String,
      guildRanks: [String],
      roles: {
        guildMemberRole: String,    // Applies if user is in the Hypixel guild          
        rankRoles: {
          rank1: String,            // For top rank (excluding GM)
          rank2: String,
          rank3: String,
          rank4: String,
          rank5: String
        }
      }
    }
  ],
    networkRankRoles: {
    type: Map,
    of: String,
    default: {}
  }
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);
