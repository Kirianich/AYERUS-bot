module.exports = {
    custimId: 'howto_button',
    async execute(interaction) {
                await interaction.reply({
                    content: '📖 **Как привязать аккаунт:**\n> 1️⃣ Зайти на сервер mc.hypixel.net\n> 2️⃣ Выбрать голову (My Profile) и нажать пкм\n> 3️⃣ Нажать на кнопку соц. сети (справа от двери).\n> 4️⃣ Нажать Discord\n> 5️⃣ Ввести свой ник в дискорде\n> 6️⃣ Вернуться сюда и нажать кнопку "✅ Привязать"' , ephemeral: true
                });
            }
        };
