const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
  customId: /^commit_network_rank:.+/,
  async execute(interaction) {
    const rank = interaction.customId.split(':')[1];
    const selectedRoleId = interaction.values[0];
    const guildId = interaction.guild.id;

    const settings = await GuildSettings.findOne({ discordGuildId: guildId }) || await GuildSettings.create({ discordGuildId: guildId });

    settings.networkRankRoles.set(rank, selectedRoleId);
    await settings.save();

    await interaction.reply({
      content: `✅ Роль для ранга **${rank.replace(/_/g, ' ')}** успешно обновлена на <@&${selectedRoleId}>.`,
      ephemeral: true
    });
  }
};