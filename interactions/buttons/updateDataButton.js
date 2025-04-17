
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { Updater } = require('../../utils/updater');

module.exports = {
  customId: 'update_data_button',
  async execute(interaction) {
    try {
      const updater = new Updater(interaction);
      await updater.process();
    } catch (error) {
      console.error('Update Error:', error);
      await interaction.reply({
        content: '❌ Ошибка при обновлении данных. Попробуйте позже.',
        ephemeral: true
      });
    }
  },
};

