const GuildSettings = require('../../../models/GuildSettings');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { buildInitialSettingsMessage } = require('../../utils/settingsUI');

module.exports = {
    customId: 'settings_configure_guild_roles',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const settings = await GuildSettings.findOne({ discordGuildId: guildId });

        if (!settings || !settings.linkedGuilds || settings.linkedGuilds.length === 0) {
            return interaction.update({
                content: '❌ Нет привязанных гильдий для настройки.',
                embeds: [],
                components: []
            });
        }

        const rows = settings.linkedGuilds.map((guild) => {
            return new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`settings_configure_guild_ranks:${guild.hypixelGuildId}`)
                    .setLabel(`⚙️ Настроить ранги - ${guild.hypixelGuildName}`)
                    .setStyle(ButtonStyle.Primary)
            );
        });

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back:root')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            content: '🎖 Выберите Hypixel-гильдию для настройки ролей рангов:',
            embeds: [],
            components: [...rows, backRow]
        });
    }
};