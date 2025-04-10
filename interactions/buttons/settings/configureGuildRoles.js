const GuildSettings = require('../../../models/GuildSettings');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { buildInitialSettingsMessage } = require('../../utils/settingsUI');

module.exports = {
    customId: 'settings_configure_guild_roles',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const settings = await GuildSettings.findOne({ discordGuildId: guildId });

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back:root')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        if (!settings || !settings.linkedGuilds || settings.linkedGuilds.length === 0) {
            const embed = new EmbedBuilder()
            .setTitle('❌ Нет привязанных гильдий для настройки.')
            .setColor(0x5865F2);
            
            return interaction.update({
                content: '',
                embeds: [embed],
                components: [backRow]
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

        const embed = new EmbedBuilder()
            .setTitle('🎖 Выберите Hypixel-гильдию для настройки ролей рангов:')
            .setColor(0x5865F2);
        
        await interaction.update({
            content: '',
            embeds: [embed],
            components: [...rows, backRow]
        });
    }
};
