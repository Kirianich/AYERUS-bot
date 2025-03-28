const { Events, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    customId: 'verify_button',
    async execute(interaction) {
            // Show a modal to ask for Minecraft username
             const modal = new ModalBuilder()
                  .setCustomId('verification_modal')
                  .setTitle('Minecraft Verification');

              const usernameInput = new TextInputBuilder()
                   .setCustomId('minecraft_username')
                   .setLabel('Введите Ваш ник в игре:')
                  .setStyle(TextInputStyle.Short)
                   .setRequired(true);

              const row = new ActionRowBuilder().addComponents(usernameInput);
               modal.addComponents(row);

               await interaction.showModal(modal);
            
        

        if (interaction.isModalSubmit()) {
            if (interaction.customId === 'verification_modal') {
                const username = interaction.fields.getTextInputValue('minecraft_username');
                const discordId = interaction.user.id;

                await interaction.reply({ content: '🔍 Проверяю, пожалуйста подождите...', ephemeral: true });

                try {
                    // Call Hypixel API
                    const response = await axios.get(`https://api.hypixel.net/player?key=YOUR_HYPIXEL_API_KEY&name=${username}`);
                    const playerData = response.data.player;

                    if (!playerData) {
                        return interaction.editReply({ content: '❌ Игрок с таким ником не найден на Hypixel!', ephemeral: true });
                    }

                    // Check if the player has linked their Discord
                    if (!playerData.socialMedia || !playerData.socialMedia.links || !playerData.socialMedia.links.DISCORD) {
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
                        return interaction.editReply({ content: '✅ Ваш аккаунт успевшно привязан!', ephemeral: true });
                    } else {
                        return interaction.editReply({ content: '❌ Не могу назначить нужную роль.', ephemeral: true });
                    }

                } catch (error) {
                    console.error(error);
                    return interaction.editReply({ content: '❌ Error fetching data. Please try again later.', ephemeral: true });
                }
            }
        }
    }
};
