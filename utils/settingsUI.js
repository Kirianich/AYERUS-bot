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
            .setLabel('🎖 Роли гильдии')
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId('settings_configure:network_ranks')
            .setLabel('🎖 Hypixel роли')
            .setStyle(ButtonStyle.Primary)
    );

    return { embed, components: [row] };
}

async function buildRoleSettingsMessage(guild) {


  return { embed, components: [buttons] };
}

async function buildGuildSelectPanel(guild) {
    

    return { embed, components: [...rows, backRow] };
}

async function buildGuildRolesMessage(guild) {
    
    return { embed, components: [row1, row2] };
}


module.exports = { buildInitialSettingsMessage, buildRoleSettingsMessage, buildGuildSelectPanel, buildGuildRolesMessage };
