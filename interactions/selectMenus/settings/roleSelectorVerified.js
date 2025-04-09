const GuildSettings = require('../../../models/GuildSettings');
const { buildRoleSettingsMessage } = require('../../../utils/settingsUI');

module.exports = {
    customId: 'settings_select_verified_role',
    async execute(interaction) {
        const selectedRoleId = interaction.values[0];
        const guildId = interaction.guild.id;

        await GuildSettings.findOneAndUpdate(
            { guildId },
            { verifiedRole: selectedRoleId },
            { upsert: true }
        );

        const { embed, components } = await buildRoleSettingsMessage(interaction.guild);
        await interaction.update({
            content: '✅ Роль для верифицированных пользователей успешно обновлена!',
            embeds: [embed],
            components
        });
    }
};
