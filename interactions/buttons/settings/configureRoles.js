const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
    customId: 'settings_configure_roles',
    async execute(interaction) {
    const settings = await GuildSettings.findOne({ discordGuildId: guild.id }) || await GuildSettings.create({ discordGuildId: guild.id });
    
  const embed = new EmbedBuilder()
    .setTitle('🔧 Настройка ролей верификации')
    .setDescription('Выберите, какую роль вы хотите настроить.')
    .addFields(
      { name: '✅ Верифицированная роль', value: settings.verifiedRole ? `<@&${settings.verifiedRole}>` : 'Не установлена', inline: true },
      { name: '⚠️ Неверифицированная роль', value: settings.unverifiedRole ? `<@&${settings.unverifiedRole}>` : 'Не установлена', inline: true },
      { name: '🚪 Роль гостей', value: settings.guestRole ? `<@&${settings.guestRole}>` : 'Не установлена', inline: true }
    )
    .setColor(0x5865F2);

  const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
      .setCustomId('settings_go_back:main')
      .setLabel('🔙 Назад')
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder()
      .setCustomId('settings_set_verified_role')
      .setLabel('✅ Установить верифицированную роль')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('settings_set_unverified_role')
      .setLabel('⚠️ Установить неверифицированную роль')
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId('settings_set_guest_role')
      .setLabel('🚪 Установить роль гостей')
      .setStyle(ButtonStyle.Secondary)
  );
        await interaction.update({ embeds: [embed], components });
    }
};
