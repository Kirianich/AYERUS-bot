const { buildInitialSettingsMessage } = require('../../../utils/settingsUI');

module.exports = {
    customId: 'settings_go_back_main',
    async execute(interaction) {
        const { embed, components } = await buildInitialSettingsMessage(interaction.guild);
        await interaction.update({ embeds: [embed], components });
    }
};
