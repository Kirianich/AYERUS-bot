const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { buildInitialSettingsMessage } = require('../utils/settingsUI');

module.exports = {
    if (!interaction.member.permissions.has('ManageGuild')) {
    return interaction.reply({
        content: '🚫 У вас недостаточно прав для использования этой команды.',
        ephemeral: true
    });
}
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
