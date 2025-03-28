const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
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
    }
};
