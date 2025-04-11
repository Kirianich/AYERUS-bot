const GuildSettings = require('../../../models/GuildSettings');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  customId: 'settings_configure_guild_roles',
  async execute(interaction) {
  const settings = await GuildSettings.findOne({ discordGuildId: guild.id }) || await GuildSettings.create({ discordGuildId: guild.id });
    const embed = new EmbedBuilder()
        .setTitle('🎖 Настройка ролей гильдии')
        .setDescription('Выберите Hypixel-гильдию для настройки ролей рангов:')
        .setColor(0x5865F2);

    const rows = settings.linkedGuilds.map(guild => {
        return new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`settings_configure_guild:${guild.hypixelGuildId}`)
                .setLabel(`⚙️ Настроить ранги - ${guild.hypixelGuildName}`)
                .setStyle(ButtonStyle.Primary)
        );
    });

    const backRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('settings_go_back:main')
            .setLabel('🔙 Назад')
            .setStyle(ButtonStyle.Danger)
    );
  await interaction.update({ embeds: [embed], components: [...rows, backRow] });
  }
};
