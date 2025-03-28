const { Events } = require('discord.js');
const axios = require('axios');

module.exports = {
    customId: 'verification_modal',
    async execute(interaction) {
            const username = interaction.fields.getTextInputValue('minecraft_username');
            const discordId = interaction.user.id;

            await interaction.reply({ content: '🔍 Проверяю, пожалуйста подождите...', ephemeral: true });

            try {
                // Call Hypixel API
                const response = await axios.get(`https://api.hypixel.net/player?key=YOUR_HYPIXEL_API_KEY&name=${username}`);

                if (!response.data.success) {
                return interaction.editReply({ content: '❌ Ошибка API Hypixel, попробуйте позже.', ephemeral: true });
            }
                
                const playerData = response.data.player;

                if (!playerData) {
                    return interaction.editReply({ content: '❌ Игрок с таким ником не найден на Hypixel!', ephemeral: true });
                }

               // Ensure socialMedia exists
            const linkedDiscord = playerData?.socialMedia?.links?.DISCORD;
            if (!linkedDiscord) {
                return interaction.editReply({ content: '❌ Нет привязанного аккаунта Discord в профиле игрока на Hypixel.', ephemeral: true });
            }

                // Compare Discord IDs
                if (playerData.socialMedia.links.DISCORD !== interaction.user.tag) {
                    return interaction.editReply({ content: '❌ Ваш привязанный Discord не соответствует текущему аккаунту!', ephemeral: true });
                }

                // Assign Verified Role
                const role = interaction.guild.roles.cache.find(r => r.name === 'Verified');
                const member = interaction.guild.members.cache.get(discordId);

                if (role && member) {
                    await member.roles.add(role);
                    return interaction.editReply({ content: '✅ Ваш аккаунт успешно привязан!', ephemeral: true });
                } else {
                    return interaction.editReply({ content: '❌ Не могу назначить нужную роль.', ephemeral: true });
                }

            } catch (error) {
                console.error(error);
                return interaction.editReply({ content: '❌ Ошибка при получении данных. Попробуйте позже.', ephemeral: true });
        }
    }
};
