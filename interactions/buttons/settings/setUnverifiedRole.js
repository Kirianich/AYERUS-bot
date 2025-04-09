const { ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'settings_set_unverified_role',
    async execute(interaction) {
        const menu = new RoleSelectMenuBuilder()
            .setCustomId('settings_select_unverified_role')
            .setPlaceholder('Выберите роль для неверифицированных пользователей')
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
            content: '',
            embeds: [📌 Пожалуйста, выберите новую роль для **неверифицированных** пользователей:],
            components: [row, backRow]
        });
    }
};
