const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
    customId: /^select_rank_role_commit:.+:.+/,
    async execute(interaction) {
        const [_, hypixelGuildId, rankIndexStr] = interaction.customId.split(':');
        const rankIndex = parseInt(rankIndexStr, 10);
        const selectedRoleId = interaction.values[0];
        const guildId = interaction.guild.id;

        const settings = await GuildSettings.findOne({ discordGuildId: guildId });
        const guildConfig = settings?.linkedGuilds.find(g => g.hypixelGuildId === hypixelGuildId);

        if (!guildConfig) {
            return interaction.reply({
                content: '❌ Не удалось найти настройки указанной гильдии.',
                ephemeral: true
            });
        }

        if (!guildConfig.rankRoles) guildConfig.rankRoles = [];
        guildConfig.rankRoles[rankIndex] = selectedRoleId;
        await settings.save();

        return interaction.reply({
            content: `✅ Роль успешно назначена для ранга **${guildConfig.guildRanks[rankIndex]}**: <@&${selectedRoleId}>`,
            ephemeral: true
        });
    }
};