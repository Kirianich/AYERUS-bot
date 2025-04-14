const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  customId: 'nickname:edit_format',
  async execute(interaction) {
    const settings = await GuildSettings.findOne({ discordGuildId: interaction.guild.id }) || {};
    const currentFormat = settings.nicknameFormat || '{networkRank} {sbLevel}★ {username}';

    const modal = new ModalBuilder()
      .setCustomId('nickname_modal')
      .setTitle('📝 Изменить формат ника');

    const input = new TextInputBuilder()
      .setCustomId('nickname_format_input')
      .setLabel('Введите новый формат ника')
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(currentFormat);

    const row = new ActionRowBuilder().addComponents(input);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }
};
