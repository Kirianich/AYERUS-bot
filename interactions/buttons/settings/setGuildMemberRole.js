const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require('discord.js');
const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
    customId: /^settings_set_guild_member_role:.+/,
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const hypixelGuildId = interaction.customId.split(':')[1];

        const settings = await GuildSettings.findOne({ discordGuildId: guildId });
        const guildConfig = settings?.linkedGuilds.find(g => g.hypixelGuildId === hypixelGuildId);

        if (!guildConfig) {
            return interaction.update({
                content: '❌ Не удалось найти гильдию в настройках.',
                ephemeral: true
            });
        }

        const currentRoleId = guildConfig.roles?.memberRole;
        const embed = new EmbedBuilder()
            .setTitle(`⚙️ Роль участников гильдии`)
            .setDescription(`Текущая роль: ${currentRoleId ? `<@&${currentRoleId}>` : '_Не назначена_'}\nВыберите новую роль для участников этой Hypixel-гильдии.`)
            .setColor(0x5865F2);

        const select = new RoleSelectMenuBuilder()
            .setCustomId(`select_guild_member_role_commit:${hypixelGuildId}`)
            .setPlaceholder('Выберите роль...')
            .setMinValues(1)
            .setMaxValues(1);

        const row = new ActionRowBuilder().addComponents(select);
        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`settings_configure_guild:${hypixelGuildId}`)
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            embeds: [embed],
            components: [row, backRow]
        });
    }
};
