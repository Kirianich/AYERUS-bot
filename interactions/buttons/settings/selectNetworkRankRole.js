const { ActionRowBuilder, RoleSelectMenuBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
  customId: /^configure_network_rank:.+/,
  async execute(interaction) {
    const rank = interaction.customId.split(':')[1];
    const guildId = interaction.guild.id;

    const settings = await GuildSettings.findOne({ discordGuildId: guildId }) || await GuildSettings.create({ discordGuildId: guildId });
    const currentRoleId = settings.networkRankRoles?.get(rank);

    const embed = new EmbedBuilder()
      .setTitle(`🎖 Настройка роли для ${rank.replace(/_/g, ' ')}`)
      .setDescription('Выберите роль, которую необходимо присвоить пользователям с этим Hypixel рангом.')
      .setColor(0x5865F2);

    embed.addFields({
      name: 'Текущая роль:',
      value: currentRoleId ? `<@&${currentRoleId}>` : '_Не задано_'
    });

    const roleSelect = new RoleSelectMenuBuilder()
      .setCustomId(`commit_network_rank:${rank}`)
      .setPlaceholder('Выберите роль…')
      .setMinValues(1)
      .setMaxValues(1);

    const goBackButton = new ButtonBuilder()
      .setCustomId('settings_configure:network_ranks')
      .setLabel('⬅️ Назад')
      .setStyle(ButtonStyle.Secondary);

    const row1 = new ActionRowBuilder().addComponents(roleSelect);
    const row2 = new ActionRowBuilder().addComponents(goBackButton);

    await interaction.update({
      embeds: [embed],
      components: [row1, row2]
    });
  }
};
