const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
    customId: 'settings_select_unverified_role',
    async execute(interaction) {
        const selectedRoleId = interaction.values[0];
        const guildId = interaction.guild.id;

        await GuildSettings.findOneAndUpdate(
            { guildId },
            { unverifiedRole: selectedRoleId },
            { upsert: true }
        );

        await interaction.update({
            content: '✅ Роль для неверифицированных пользователей обновлена!',
            embeds: [],
            components: []
        });
    }
};
