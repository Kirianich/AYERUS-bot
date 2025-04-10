const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
    customId: /^select_rank_role_commit:.+:.+/,
    async execute(interaction) {
        const [_, hypixelGuildId, rankIndexStr] = interaction.customId.split(':');
        const rankIndex = parseInt(rankIndexStr, 10);
        const selectedRoleId = interaction.values[0];
        const guildId = interaction.guild.id;

        const settings = await GuildSettings.findOne({ discordGuildId: guildId });
        const index = settings?.linkedGuilds.findIndex(g => g.hypixelGuildId === hypixelGuildId);

        if (!settings || index === -1) {
            return interaction.reply({
                content: '❌ Не удалось найти настройки указанной гильдии.',
                ephemeral: true
            });
        }

        const rankKey = `rank${rankIndex + 1}`;
        settings.linkedGuilds[index].roles.rankRoles[rankKey] = selectedRoleId;
        await settings.save();

        return interaction.reply({
            content: `✅ Роль успешно назначена для ранга **${settings.linkedGuilds[index].guildRanks[rankIndex]}**: <@&${selectedRoleId}>`,
            ephemeral: true
        });
    }
};
