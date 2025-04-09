const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../../../models/GuildSettings');

module.exports = {
    customId: 'settings_configure_roles',
    async execute(interaction) {
        const guildId = interaction.guild.id;
        let settings = await GuildSettings.findOne({ guildId });
        if (!settings) {
            settings = await GuildSettings.create({ guildId });
        }

        const embed = new EmbedBuilder()
            .setTitle('🔧 Настройка ролей верификации')
            .setDescription('Выберите, какую роль вы хотите настроить.')
            .addFields(
                { name: '✅ Проверенная роль', value: settings.verifiedRole ? `<@&${settings.verifiedRole}>` : 'Не установлена', inline: true },
                { name: '⚠️ Непроверенная роль', value: settings.unverifiedRole ? `<@&${settings.unverifiedRole}>` : 'Не установлена', inline: true }
            )
            .setFooter('Выберите какую роль вы хотите настроить с помощью кнопок внизу')
            .setColor(0x5865F2);

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back_main')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('settings_set_verified_role')
                .setLabel('✅ Роль проверенных')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('settings_set_unverified_role')
                .setLabel('⚠️ Роль непроверенных')
                .setStyle(ButtonStyle.Secondary)
            
        );

        await interaction.update({ embeds: [embed], components: [buttons] });
    }
};
