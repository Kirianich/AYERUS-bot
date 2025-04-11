const GuildSettings = require('../../../models/GuildSettings');
const { buildGuildRolesMessage } = require('../../../utils/settingsUI');

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

        console.log('Guild Name:', guildConfig?.hypixelGuildName);
        console.log('Guild ID:', hypixelGuildId);
        const { embed, components } = buildGuildRolesMessage(guildConfig);

        console.log('Embed:', embed?.data);
        console.log('Components:', components?.length);
        
        await interaction.update({
            embeds: [embed],
            components
        });
    }
};
