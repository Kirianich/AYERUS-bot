const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = {
    customId: 'verify_button',
    async execute(interaction) {
                
            // Show a modal to ask for Minecraft username
             const modal = new ModalBuilder()
                  .setCustomId('verification_modal')
                  .setTitle('🔒 Верификация');

              const usernameInput = new TextInputBuilder()
                   .setCustomId('minecraft_username')
                   .setLabel('Введите Ваш ник в игре:')
                   .setStyle(TextInputStyle.Short)
                   .setRequired(true);

            const row = new ActionRowBuilder().addComponents(usernameInput);
            modal.addComponents(row);

            await interaction.showModal(modal);  
            console.log("🔍 Received interaction for:", interaction.customId);
        }
    };
