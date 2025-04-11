const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

async function buildInitialSettingsMessage(guild) {
    const embed = new EmbedBuilder()
        .setTitle('⚙️ Настройки бота')
        .setDescription('Нажмите на кнопку ниже, чтобы перейти к настройкам.')
        .setColor(0x5865F2);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('settings_configure_roles')
            .setLabel('⚙️ Основные роли')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('settings_configure_guild_roles')
            .setLabel('🎖 Настроить роли гильдии')
            .setStyle(ButtonStyle.Primary)
    );

    return { embed, components: [row] };
}

async function buildRoleSettingsMessage(guild) {
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

  return { embed, components: [buttons] };
}

async function buildGuildSelectPanel(guild) {
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

    return { embed, components: [...rows, backRow] };
}

async function buildGuildRolesMessage(guild) {
    const embed = new EmbedBuilder()
        .setTitle(`⚙️ Настройка гильдии: ${guild.hypixelGuildName}`)
        .setDescription('Выберите настройку, которую вы хотите изменить:')
        .setColor(0x5865F2);

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`settings_configure_guild_ranks:${guild.hypixelGuildId}`)
            .setLabel('🎖 Настроить ранги гильдии')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`settings_set_guild_member_role:${guild.hypixelGuildId}`)
            .setLabel('👥 Роль участников гильдии')
            .setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('settings_go_back:guilds')
            .setLabel('🔙 Назад')
            .setStyle(ButtonStyle.Danger)
    );

    return { embed, components: [row1, row2] };
}


module.exports = { buildInitialSettingsMessage, buildRoleSettingsMessage, buildGuildSelectPanel, buildGuildRolesMessage };
