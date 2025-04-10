const GuildSettings = require('../../../models/GuildSettings');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: /^settings_configure_guild_ranks:.+/,
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const hypixelGuildId = interaction.customId.split(':')[1];

        const settings = await GuildSettings.findOne({ discordGuildId: guildId });
        const guildConfig = settings?.linkedGuilds.find(g => g.hypixelGuildId === hypixelGuildId);

        if (!guildConfig) {
            return interaction.update({
                embeds: [],
                components: [],
                content: '❌ Гильдия не найдена в настройках.'
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(`⚙️ Настройка ролей: ${guildConfig.hypixelGuildName}`)
            .setDescription('Выберите роль для каждого ранга Hypixel-гильдии.')
            .setColor(0x5865F2);

        // Build one row with up to 5 buttons for ranks
        const rankButtons = guildConfig.guildRanks.slice(0, 5).map((rank, index) =>
            new ButtonBuilder()
                .setCustomId(`settings_select_rank_role:${hypixelGuildId}:${index + 1}`)
                .setLabel(`🎖 ${rank}`)
                .setStyle(ButtonStyle.Secondary)
        );
        const rankRow = new ActionRowBuilder().addComponents(rankButtons);

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back:guilds')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            embeds: [embed],
            components: [rankRow, backRow]
        });
    }
};
