const GuildSettings = require('../../../models/GuildSettings');
const { buildGuildRolesMessage } = require('../../modules/settingsUI');

module.exports = {
    customId: /^settings_configure_guild:.+/,
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const hypixelGuildId = interaction.customId.split(':')[1];

        const settings = await GuildSettings.findOne({ discordGuildId: guildId });
        const guildConfig = settings?.linkedGuilds.find(g => g.hypixelGuildId === hypixelGuildId);

        if (!guildConfig) {
            return interaction.reply({ content: '❌ Гильдия не найдена в настройках.', ephemeral: true });
        }

        const { embed, components } = buildGuildRolesMessage(guildConfig.hypixelGuildName, hypixelGuildId);

        await interaction.update({
            embeds: [embed],
            components
        });
    }
};
