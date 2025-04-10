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

        const rows = guildConfig.guildRanks.slice(0, 5).map((rank, index) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`settings_select_rank_role:${hypixelGuildId}:${index + 1}`)
                    .setLabel(`🎖 ${rank}`)
                    .setStyle(ButtonStyle.Secondary)
            );
        });

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back:main')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            embeds: [embed],
            components: [...rows, backRow]
        });
    }
};