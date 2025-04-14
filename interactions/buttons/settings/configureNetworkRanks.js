const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  customId: 'settings_configure:network_ranks',
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🎖 Настройка Hypixel Rank ролей')
      .setDescription('Выберите Discord-роль для каждого Hypixel ранга:')
      .setColor(0x5865F2);

    const ranks = ['DEFAULT', 'VIP', 'VIP_PLUS', 'MVP', 'MVP_PLUS', 'MVP_PLUS_PLUS', 'YOUTUBE', 'ADMIN'];

    const buttons = ranks.map(rank =>
      new ButtonBuilder()
        .setCustomId(`configure_network_rank:${rank}`)
        .setLabel(rank.replace(/_/g, ' '))
        .setStyle(ButtonStyle.Secondary)
    );

    const backButton = new ButtonBuilder()
      .setCustomId('settings_go_back:main')
      .setLabel('⬅️ Назад')
      .setStyle(ButtonStyle.Danger);

    const rows = [
      new ActionRowBuilder().addComponents(buttons.slice(0, 5)),
      new ActionRowBuilder().addComponents(buttons.slice(5).concat(backButton))
    ];

    await interaction.update({ embeds: [embed], components: rows });
  }
};