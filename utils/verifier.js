// utils/Verifier.js
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

      const guild = await this.hypixel.getGuild('player', username);
      let isInLinkedGuild = false;
      let userGuildRank = null;

      if (settings.linkedGuilds && guild) {
        const guildMember = guild.members.find(m => m.uuid === player.uuid);
        userGuildRank = guildMember?.rank;

        console.log('🧩 Player rank from Hypixel:', userGuildRank);
        const guildConfig = settings.linkedGuilds.find(g => g.hypixelGuildId === guild.id);
        if (guildConfig) {
          isInLinkedGuild = true;

          const memberRole = interaction.guild.roles.cache.get(guildConfig.roles.guildMemberRole);
          if (memberRole) await member.roles.add(memberRole);

          const rankIndex = guildConfig.guildRanks.findIndex(rank => rank === userGuildRank);
          console.log('🔍 Matched rank index:', rankIndex);

          if (rankIndex !== -1) {
            const rankKey = `rank${rankIndex + 1}`;
            const rankRoleId = guildConfig.roles.rankRoles?.[rankKey];
            console.log('🎯 Role ID to assign for rank:', rankRoleId);

            const rankRole = interaction.guild.roles.cache.get(rankRoleId);
            if (rankRole) {
              await member.roles.add(rankRole);
              console.log('✅ Guild rank role assigned');
            } else {
              console.warn('⚠️ Rank role not found in guild roles cache');
            }
          } else {
            console.warn('⚠️ Player rank not matched in guildRanks');
          }
        }
      }

      if (!isInLinkedGuild && settings.guestRole) {
        const guestRole = interaction.guild.roles.cache.get(settings.guestRole);
        if (guestRole) await member.roles.add(guestRole);
      }

      const rankKeyMap = {
        'DEFAULT': 'DEFAULT',
        'VIP': 'VIP',
        'VIP+': 'VIP_PLUS',
        'MVP': 'MVP',
        'MVP+': 'MVP_PLUS',
        'MVP++': 'MVP_PLUS_PLUS',
        'YOUTUBE': 'YOUTUBE',
        'ADMIN': 'ADMIN',
        'HELPER': 'HELPER',
        'MODERATOR': 'MODERATOR'
      };

      const normalizedRankKey = rankKeyMap[player.rank] || null;

      // Assign Network Rank Role
      if (settings.networkRankRoles && normalizedRankKey) {
        const rankRoleId = settings.networkRankRoles.get(normalizedRankKey);
      if (rankRoleId) {
        const rankRole = interaction.guild.roles.cache.get(rankRoleId);
      if (rankRole) {
        await member.roles.add(rankRole);
        console.log(`✅ Network rank role "${normalizedRankKey}" assigned`);
      } else {
        console.warn(`⚠️ Network rank role ID "${rankRoleId}" not found in cache`);
      }
      } else {
        console.log(`ℹ️ No role configured for network rank: ${normalizedRankKey}`);
      }
    }
      
      await User.create({
        discordId,
        username,
        guildId,
        hypixelUuid: player.uuid,
        hypixelRank: player.rank || "NONE",
        hypixelGuild: guild?.name || "None",
        hypixelGuildRank: userGuildRank || "None"
      });

      return { success: '✅ Ваш аккаунт успешно привязан!' };
    } catch (error) {
      console.error("Verifier Error:", error);
      return { error: '❌ Ошибка при верификации. Попробуйте позже.' };
    }
  }
}

module.exports = Verifier;
