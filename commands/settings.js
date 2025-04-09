const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { buildInitialSettingsMessage } = require('../utils/settingsUI');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Configure bot settings for this server'),
    async execute(interaction) {
        const { embed, components } = await buildInitialSettingsMessage(interaction.guild);

        await interaction.reply({
            embeds: [embed],
            components,
            ephemeral: false
        });
    }
};
