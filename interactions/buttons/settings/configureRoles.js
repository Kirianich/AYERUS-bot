const { buildRoleSettingsMessage } = require('../../../utils/settingsUI');

module.exports = {
    customId: 'settings_configure_roles',
    async execute(interaction) {
        const { embed, components } = await buildRoleSettingsMessage(interaction.guild);
        await interaction.update({ embeds: [embed], components });
    }
};
