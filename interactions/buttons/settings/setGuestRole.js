const { ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'settings_set_guest_role',
    async execute(interaction) {
        const menu = new RoleSelectMenuBuilder()
            .setCustomId('settings_select_guest_role')
            .setPlaceholder('Выберите роль для гостей')
            .setMinValues(1)
            .setMaxValues(1);

        const row = new ActionRowBuilder().addComponents(menu);

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back:roles')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.update({
            content: '📌 Пожалуйста, выберите роль для **гостей** (нечленов Hypixel-гильдии):',
            embeds: [],
            components: [row, backRow]
        });
    }
};