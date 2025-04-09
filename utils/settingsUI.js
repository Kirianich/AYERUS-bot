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
            .setLabel('⚙️ Настроить роли верификации')
            .setStyle(ButtonStyle.Primary)
    );

    return { embed, components: [row] };
}

module.exports = { buildInitialSettingsMessage };
