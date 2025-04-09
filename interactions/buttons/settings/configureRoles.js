const { buildRoleSettingsMessage } = require('../../../utils/settingsUI');
const { embed, components } = await buildRoleSettingsMessage(interaction.guild);
await interaction.update({ embeds: [embed], components });
