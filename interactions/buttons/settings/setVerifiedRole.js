const { ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    customId: 'settings_set_verified_role',
    async execute(interaction) {
        const menu = new RoleSelectMenuBuilder()
            .setCustomId('settings_select_verified_role')
            .setPlaceholder('Выберите роль для верифицированных пользователей')
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
            content: '📌 Пожалуйста, выберите новую роль для **верифицированных** пользователей:',
            embeds: [],
            components: [row, backRow]
        });
    }
};
