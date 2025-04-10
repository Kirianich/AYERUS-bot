const { buildInitialSettingsMessage, buildRoleSettingsMessage } = require('../../../utils/settingsUI');

module.exports = {
    customId: 'settings_go_back',
    async execute(interaction) {
        const target = interaction.customId.split(':')[1];

        if (target === 'main') {
            const { embed, components } = await buildInitialSettingsMessage(interaction.guild);
            return interaction.update({ embeds: [embed], components });
        }

        if (target === 'roles') {
            const { embed, components } = await buildRoleSettingsMessage(interaction.guild);
            return interaction.update({ embeds: [embed], components });
        }

         if (target === 'guilds') {
            const { embed, components } = await buildGuildSelectPanel(interaction.guild);
            return interaction.update({ embeds: [embed], components });
        }

        return interaction.reply({ content: '❌ Не удалось вернуться назад.', ephemeral: true });
    }
};
