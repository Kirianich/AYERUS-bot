const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
  customId: 'settings_configure:network_ranks',
  async execute(interaction) {
    const guildId = interaction.guild.id;
    const settings = await GuildSettings.findOne({ discordGuildId: guildId }) || await GuildSettings.create({ discordGuildId: guildId });

    const embed = new EmbedBuilder()
      .setTitle('🎖 Настройка Hypixel Rank ролей')
      .setDescription('Выберите Discord-роль для каждого Hypixel ранга:')
      .setColor(0x5865F2);

    const ranks = ['DEFAULT', 'VIP', 'VIP_PLUS', 'MVP', 'MVP_PLUS', 'MVP_PLUS_PLUS', 'YOUTUBE', 'ADMIN'];
    const roleLines = [];

    const buttons = ranks.map(rank => {
      const roleId = settings.networkRankRoles?.get(rank) || null;
      if (roleId) {
        roleLines.push(`**${rank.replace(/_/g, ' ')}** ➝ <@&${roleId}>`);
      } else {
        roleLines.push(`**${rank.replace(/_/g, ' ')}** ➝ _Не задано_`);
      }

      return new ButtonBuilder()
        .setCustomId(`configure_network_rank:${rank}`)
        .setLabel(rank.replace(/_/g, ' '))
        .setStyle(roleId ? ButtonStyle.Success : ButtonStyle.Secondary);
    });

    embed.addFields({ name: 'Текущие настройки:', value: roleLines.join('\n') });

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
