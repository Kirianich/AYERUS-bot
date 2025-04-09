const GuildSettings = require('../../../models/GuildSettings');
const { buildRoleSettingsMessage } = require('../../../utils/settingsUI');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'settings_select_unverified_role',
    async execute(interaction) {
        const selectedRoleId = interaction.values[0];
        const guildId = interaction.guild.id;

        console.log("Selected Role:", selectedRoleId);
        console.log("Guild ID:", guildId);

        await GuildSettings.findOneAndUpdate(
            { guildId },
            { unverifiedRole: selectedRoleId },
            { upsert: true }
        );

        const { embed, components } = await buildRoleSettingsMessage(interaction.guild);

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back:roles')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            content: '✅ Роль для неверифицированных пользователей успешно обновлена!',
            embeds: [embed],
            components: [...components, backRow]
        });
    }
};
