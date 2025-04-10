const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
    customId: 'settings_select_guest_role',
    async execute(interaction) {
        try {
            const selectedRoleId = interaction.values[0];
            const guildId = interaction.guild.id;

            await GuildSettings.findOneAndUpdate(
                { discordGuildId: guildId },
                { guestRole: selectedRoleId },
                { upsert: true }
            );

            await interaction.update({
                content: '✅ Роль для гостей успешно обновлена!',
                embeds: [],
                components: []
            });
        } catch (error) {
            console.error("❌ Ошибка при обновлении роли для гостей:", error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ Произошла ошибка при сохранении роли.',
                    ephemeral: true
                });
            }
        }
    }
};