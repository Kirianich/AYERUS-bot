const { SlashCommandBuilder } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verifiedrole')
        .setDescription('Устанавливает роль верифицированных пользователей')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Выберите роль для верификации')
                .setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has('MANAGE_ROLES')) {
            return interaction.reply({ content: '❌ У вас нет прав для выполнения этой команды.', ephemeral: true });
        }

        const role = interaction.options.getRole('role');

        await GuildSettings.findOneAndUpdate(
            { guildId: interaction.guild.id },
            { verifiedRole: role.id },
            { upsert: true }
        );

        return interaction.reply({ content: `✅ Роль верификации установлена: ${role.name}`, ephemeral: true });
    }
};
