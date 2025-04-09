const GuildSettings = require('../../../models/GuildSettings');
const { MessageFlags } = require('discord.js');

module.exports = {
    customId: 'settings_select_verified_role',
    async execute(interaction) {
        try {
            const selectedRoleId = interaction.values[0];
            const guildId = interaction.guild.id;

            console.log("🔧 Selected verified role ID:", selectedRoleId);
            console.log("🔧 Guild ID:", guildId);

            const result = await GuildSettings.findOneAndUpdate(
                { guildId },
                { verifiedRole: selectedRoleId },
                { upsert: true, new: true }
            );

            console.log("✅ Updated DB record:", result);

            await interaction.reply({
                content: '✅ Роль для верифицированных пользователей обновлена!',
                embeds: [],
                components: [],
                flags: MessageFlags.Ephemeral
            });

        } catch (error) {
            console.error("❌ Error updating verified role:", error);
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ Произошла ошибка при сохранении роли.',
                    ephemeral: true
                });
            }
        }
    }
};
