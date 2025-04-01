const { EmbedBuilder } = require('discord.js');

module.exports = {
    customId: 'howto_button',
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x63eb6f) // Change color as needed
            .setTitle('📖 Как привязать аккаунт')
            .setDescription(
                '1️⃣ **Зайти на сервер** `mc.hypixel.net`\n' +
                '2️⃣ **Выбрать голову (My Profile) и нажать ПКМ**\n' +
                '3️⃣ **Нажать на кнопку соц. сети (справа от двери).**\n' +
                '4️⃣ **Нажать Discord**\n' +
                '5️⃣ **Ввести свой ник в Дискорде**\n' +
                '6️⃣ **Вернуться сюда и нажать кнопку "✅ Привязать"**'
            )
            .addFields(
                { 
                    name: '❓ Частые проблемы', 
                    value: '> 1. Убедитесь, что ник не содержит специальных символов. Допускаются никнеймы только с буквами и цифрами\n' +
                           '> 2. Также убедитесь, что привязываете дискорд на сервере через **профиль игрока**, а не через команду /discord.', 
                    inline: false 
                }
            )
            .setFooter({ text: 'Если возникли вопросы, обратитесь к администрации.' });

        return interaction.reply({ embeds: [embed], ephemeral: true });
    }
};
