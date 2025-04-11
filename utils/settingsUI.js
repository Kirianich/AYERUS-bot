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
    
    return { embed, components: [row1, row2] };
}


module.exports = { buildInitialSettingsMessage, buildRoleSettingsMessage, buildGuildSelectPanel, buildGuildRolesMessage };
