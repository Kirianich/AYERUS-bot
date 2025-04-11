const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
  customId: /^settings_select_guild_member_role_commit:(.+)$/,

  async execute(interaction) {
    const hypixelGuildId = interaction.customId.split(':')[1];
    const selectedRoleId = interaction.values[0];
    const guildId = interaction.guild.id;

    try {
      const settings = await GuildSettings.findOne({ discordGuildId: guildId });
      if (!settings) {
        return interaction.reply({ content: '⚠️ Настройки сервера не найдены.', ephemeral: true });
      }

      const guildConfig = settings.linkedGuilds.find(g => g.hypixelGuildId === hypixelGuildId);
      if (!guildConfig) {
        return interaction.reply({ content: '⚠️ Привязанная гильдия не найдена.', ephemeral: true });
      }

      guildConfig.roles.guildMemberRole = selectedRoleId;
      await settings.save();

      await interaction.reply({ content: '✅ Роль участников гильдии обновлена.', ephemeral: true });
    } catch (err) {
      console.error('Error updating guild member role:', err);
      await interaction.reply({ content: '❌ Произошла ошибка при сохранении роли.', ephemeral: true });
    }
  }
};
