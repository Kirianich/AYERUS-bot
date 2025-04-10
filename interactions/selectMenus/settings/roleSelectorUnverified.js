const GuildSettings = require('../../../models/GuildSettings');
const { MessageFlags } = require('discord.js');

module.exports = {
    customId: 'settings_select_unverified_role',
    async execute(interaction) {
        try {
            const selectedRoleId = interaction.values[0];
            const dsicordGuildId = interaction.guild.id;

            console.log("🔧 Selected unverified role ID:", selectedRoleId);
            console.log("🔧 Guild ID:", discordGuildId);

            const result = await GuildSettings.findOneAndUpdate(
                { discordGuildId },
                { unverifiedRole: selectedRoleId },
                { upsert: true, new: true }
            );

            console.log("✅ Updated DB record:", result);

            await interaction.reply({
                content: '✅ Роль для неверифицированных пользователей обновлена!',
                embeds: [],
                components: [],
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error("❌ Error updating unverified role:", error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ Произошла ошибка при сохранении роли.',
                    ephemeral: true
                });
            }
        }
    }
};
