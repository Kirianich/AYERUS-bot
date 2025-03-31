const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const User = require('../../models/User'); // Import the User model

module.exports = {
    customId: 'verify_button',
    async execute(interaction) {
            const discordId = interaction.user.id;

            try {
            // Check if the user is already verified in the database
            const existingUser = await User.findOne({ discordId });

            if (existingUser) {
                return interaction.reply({content: '✅ Вы уже верифицированы!', ephemeral: true });
            }
                
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
        }
    }
};
