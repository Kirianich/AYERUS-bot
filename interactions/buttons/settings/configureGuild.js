const GuildSettings = require('../../../models/GuildSettings');
const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

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

        const embed = new EmbedBuilder()
        .setTitle(`⚙️ Настройка гильдии: ${guild.hypixelGuildName}`)
        .setDescription('Выберите настройку, которую вы хотите изменить:')
        .setColor(0x5865F2);

    const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`settings_configure_guild_ranks:${guild.hypixelGuildId}`)
            .setLabel('🎖 Настроить ранги гильдии')
            .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
            .setCustomId(`settings_set_guild_member_role:${guild.hypixelGuildId}`)
            .setLabel('👥 Роль участников гильдии')
            .setStyle(ButtonStyle.Secondary)
    );

    const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('settings_go_back:guilds')
            .setLabel('🔙 Назад')
            .setStyle(ButtonStyle.Danger)
    );

        await interaction.update({
            embeds: [embed],
            components: [row1, row2]
        });
    }
};
