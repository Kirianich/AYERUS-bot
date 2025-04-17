
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'update_data_button',
  async execute(interaction) {
    const updater = require('../../utils/updater');
    try {
      await updater(interaction);
    } catch (error) {
      console.error('Update Error:', error);
      await interaction.reply({ content: '❌ Ошибка при обновлении данных. Попробуйте позже.', ephemeral: true });
    }
  },
};
