const { ActionRowBuilder, RoleSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'settings_set_unverified_role',
    async execute(interaction) {
        const menu = new RoleSelectMenuBuilder()
            .setCustomId('settings_select_unverified_role')
            .setPlaceholder('Выберите роль')
            .setMinValues(1)
            .setMaxValues(1);

        const row = new ActionRowBuilder().addComponents(menu);

        const backRow = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('settings_go_back:roles')
                .setLabel('🔙 Назад')
                .setStyle(ButtonStyle.Danger)
        );

        const embed = new EmbedBuilder()
            .setTitle('📌 Пожалуйста, выберите новую роль для **неверифицированных** пользователей:')
            .setColor(0x5865F2);
        
        await interaction.update({
            content: '',
            embeds: [embed],
            components: [row, backRow]
        });
    }
};
