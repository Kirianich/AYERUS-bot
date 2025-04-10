const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { buildInitialSettingsMessage } = require('../utils/settingsUI');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Configure bot settings for this server')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({
                content: '🚫 У вас недостаточно прав для использования этой команды.',
                ephemeral: true
            });
        }

        const { embed, components } = await buildInitialSettingsMessage(interaction.guild);

        await interaction.reply({
            embeds: [embed],
            components,
            ephemeral: false
        });
    }
};
