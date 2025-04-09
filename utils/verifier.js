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
    try {
      // Check DB if already verified
      const existingUser = await User.findOne({ discordId });
      if (existingUser) return { error: '✅ Вы уже верифицированы!' };

      // Get player and guild info
      const player = await this.hypixel.getPlayer(username);
      console.log(player.socialMedia);
      const guild = await this.hypixel.getGuild('player', username);

      const linkedDiscord = player.socialMedia?.links?.DISCORD;
      console.log(`Linked Hypixel Discord = ${linkedDiscord}`);
      const currentDiscord = interaction.user.username; // New username system fallback
      console.log(`User interacted Discord = ${currentDiscord}`);

      if (!linkedDiscord || linkedDiscord !== currentDiscord) {
        return { error: `❌ Ваш привязанный Discord (${linkedDiscord || 'не указан'}) не совпадает с текущим!` };
      }

      const settings = await GuildSettings.findOne({ guildId: interaction.guild.id });
      if (!settings || !settings.verifiedRole) {
        return { error: '❌ Роль верифицированных пользователей не настроена. Используйте `/setverifiedrole`' };
      }

      const role = interaction.guild.roles.cache.get(settings.verifiedRole);
      const member = await interaction.guild.members.fetch(discordId);

      if (role && member) {
        await member.roles.add(role);

        await User.create({
          discordId,
          username,
          guildId: interaction.guild.id,
          hypixelUuid: player.uuid,
          hypixelRank: player.rank || "NONE",
          hypixelGuild: guild?.name || "None",
          hypixelGuildRank: guild?.members.find(m => m.uuid === player.uuid)?.rank.toString || "None"
        });

        return { success: '✅ Ваш аккаунт успешно привязан!' };
      } else {
        return { error: '❌ Не удалось назначить роль.' };
      }
    } catch (error) {
      console.error("Verifier Error:", error);
      return { error: '❌ Ошибка при верификации. Попробуйте позже.' };
    }
  }
}

module.exports = Verifier;
