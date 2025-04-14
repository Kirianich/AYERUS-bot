const { ActionRowBuilder, RoleSelectMenuBuilder } = require('discord.js');

module.exports = {
  customId: 'nickname:edit_ignored',
  async execute(interaction) {
    const roleSelect = new RoleSelectMenuBuilder()
      .setCustomId('nickname:edit_ignored')
      .setPlaceholder('Выберите роли, которые будут игнорироваться')
      .setMinValues(0)
      .setMaxValues(25);

    const row = new ActionRowBuilder().addComponents(roleSelect);

    await interaction.reply({
      content: '🎯 Выберите роли, при наличии которых ник пользователя не будет обновлён:',
      components: [row],
      ephemeral: true
    });
  }
};