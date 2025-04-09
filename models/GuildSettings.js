const mongoose = require('mongoose');

const GuildSettingsSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    verifiedRole: { type: String, default: null },
    unverifiedRole: { type: String, default: null },
    guestRole: { type: String, default: null }, // Applies if user is NOT in any linked guild

    linkedGuilds: [
    {
      hypixelGuildId: String,
      hypixelGuildName: String,
      roles: {
        guildMemberRole: String,    // Applies if user is in the Hypixel guild          
        rankRoles: {
          rank1: String,            // For top rank (excluding GM)
          rank2: String,
          rank3: String,
          rank4: String
        }
      }
    }
  ]
});

module.exports = mongoose.model('GuildSettings', GuildSettingsSchema);
