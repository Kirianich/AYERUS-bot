// utils/Verifier.js
const Hypixel = require('hypixel-api-reborn');
const User = require('../models/User');
const GuildSettings = require('../models/GuildSettings');

class Verifier {
  constructor(apiKey) {
    this.hypixel = new Hypixel.Client(apiKey);
  }

  async verifyUser(interaction, username) {
    const discordId = interaction.user.id;
    const guildId = interaction.guild.id;

    try {
      const existingUser = await User.findOne({ discordId });
      if (existingUser) return { error: '✅ Вы уже верифицированы!' };

      const player = await this.hypixel.getPlayer(username);
      const guild = await this.hypixel.getGuild('player', username);

      const discordEntry = player.socialMedia.find(social => social.id === 'DISCORD');
      const linkedDiscord = discordEntry?.link;
      const currentDiscord = interaction.user.username;

      if (!linkedDiscord || linkedDiscord !== currentDiscord) {
        return { error: `❌ Ваш привязанный Discord (${linkedDiscord || 'не указан'}) не совпадает с текущим!` };
      }

      const settings = await GuildSettings.findOne({ discordGuildId: guildId });
      if (!settings || !settings.verifiedRole) {
        return { error: '❌ Роль верифицированных пользователей не настроена. Используйте `/setverifiedrole`' };
      }

      const member = await interaction.guild.members.fetch(discordId);

      // Assign Verified Role
      const verifiedRole = interaction.guild.roles.cache.get(settings.verifiedRole);
      if (verifiedRole) await member.roles.add(verifiedRole);

      // Remove Unverified Role if set
      if (settings.unverifiedRole) {
        const unverifiedRole = interaction.guild.roles.cache.get(settings.unverifiedRole);
        if (unverifiedRole) await member.roles.remove(unverifiedRole);
      }

      let isInLinkedGuild = false;

      if (settings.linkedGuilds && guild) {
        const guildConfig = settings.linkedGuilds.find(g => g.hypixelGuildId === guild.id);
        if (guildConfig) {
          isInLinkedGuild = true;

          // Assign guild member role
          const memberRole = interaction.guild.roles.cache.get(guildConfig.roles.guildMemberRole);
          if (memberRole) await member.roles.add(memberRole);

          // Assign guild rank role if available
          const guildRank = guild.members.find(m => m.uuid === player.uuid)?.rank;
          const rankRoleId = guildConfig.roles.rankRoles?.[guildRank];
          const rankRole = interaction.guild.roles.cache.get(rankRoleId);
          if (rankRole) await member.roles.add(rankRole);
        }
      }

      if (!isInLinkedGuild && settings.guestRole) {
        const guestRole = interaction.guild.roles.cache.get(settings.guestRole);
        if (guestRole) await member.roles.add(guestRole);
      }

      await User.create({
        discordId,
        username,
        guildId,
        hypixelUuid: player.uuid,
        hypixelRank: player.rank || "NONE",
        hypixelGuild: guild?.name || "None",
        hypixelGuildRank: guild?.members.find(m => m.uuid === player.uuid)?.rank || "None"
      });

      return { success: '✅ Ваш аккаунт успешно привязан!' };
    } catch (error) {
      console.error("Verifier Error:", error);
      return { error: '❌ Ошибка при верификации. Попробуйте позже.' };
    }
  }
}

module.exports = Verifier;
