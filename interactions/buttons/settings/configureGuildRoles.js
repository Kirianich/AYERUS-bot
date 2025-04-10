const GuildSettings = require('../../../models/GuildSettings');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { buildInitialSettingsMessage, buildGuildSelectPanel } = require('../../../utils/settingsUI');

module.exports = {
  customId: 'settings_configure_guild_roles',
  async execute(interaction) {
  const { embed, components } = await buildGuildSelectPanel(guild);
  await interaction.update({ embeds: [embed], components });
  }
};
