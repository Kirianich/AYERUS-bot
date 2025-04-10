const GuildSettings = require('../../../models/GuildSettings');
const { EmbedBuilder, ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: /^settings_select_rank_role:.+:.+/,
    async execute(interaction) {
        const [_, hypixelGuildId, rankIndexStr] = interaction.customId.split(':');
        const rankIndex = parseInt(rankIndexStr, 10) - 1;
        const guildId = interaction.guild.id;

        const settings = await GuildSettings.findOne({ discordGuildId: guildId });
        const guildConfig = settings?.linkedGuilds.find(g => g.hypixelGuildId === hypixelGuildId);

        if (!guildConfig || !guildConfig.guildRanks || !guildConfig.guildRanks[rankIndex]) {
            return interaction.update({
                content: '❌ Невозможно найти указанный ранг гильдии.',
                embeds: [],
                components: []
            });
        }

        const rankName = guildConfig.guildRanks[rankIndex];
        const rankKey = `rank${rankIndex + 1}`;
        const currentRoleId = guildConfig.roles?.rankRoles?.[rankKey] || 'Не назначена';

        const embed = new EmbedBuilder()
            .setTitle(`🎖 Настройка роли для ранга: ${rankName}`)
            .setDescription(`Текущая роль: ${currentRoleId ? `<@&${currentRoleId}>` : 'Не назначена'}\n Выберите новую роль для этого ранга.`)
            .setColor(0x5865F2);

        const selectMenu = new RoleSelectMenuBuilder()
            .setCustomId(`select_rank_role_commit:${hypixelGuildId}:${rankIndex}`)
            .setPlaceholder('Выберите роль...');

        const selectRow = new ActionRowBuilder().addComponents(selectMenu);

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`settings_configure_guild_ranks:${hypixelGuildId}`)
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            embeds: [embed],
            components: [selectRow, backRow]
        });
    }
};
