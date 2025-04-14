const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  customId: 'nickname:edit_ignored',
  async execute(interaction) {
    const roles = interaction.values;
    const guildId = interaction.guild.id;

    await GuildSettings.findOneAndUpdate(
      { discordGuildId: guildId },
      { ignoredRoles: roles },
      { upsert: true }
    );

    await interaction.reply({
      content: `✅ Игнорируемые роли обновлены: ${roles.map(r => `<@&${r}>`).join(', ')}`,
      ephemeral: true
    });
  }
};
