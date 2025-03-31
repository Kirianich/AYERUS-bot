const { Events } = require('discord.js');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../../models/User'); // Schema for storing verified users
const GuildSettings = require('../../models/GuildSettings'); // Stores guild-specific settings
require('dotenv').config();

module.exports = {
    customId: 'verification_modal',
    async execute(interaction) {
        const username = interaction.fields.getTextInputValue('minecraft_username');
        const discordId = interaction.user.id;

        await interaction.deferReply({ ephemeral: true });

        try {
            // Check if user is already verified
            const existingUser = await User.findOne({ discordId });
            if (existingUser) {
                return interaction.editReply({ content: '✅ Вы уже верифицированы!', ephemeral: true });
            }

            // Call Hypixel API
            const response = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&name=${username}`);
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

            const discordUsername = interaction.user.globalName; // New format (since Discord removed discriminators)
            // Check if the linked Discord matches either format
            const linkedDiscordNormalized = linkedDiscord.toLowerCase().trim();
            const discordUsernameNormalized = discordUsername.toLowerCase().trim();
            
            if (linkedDiscordNormalized !== discordUsernameNormalized) {
                return interaction.editReply({ 
                content: `❌ Ваш привязанный Discord (${linkedDiscord}) не совпадает с текущим!`, ephemeral: true });
            }

            // Fetch the verified role from MongoDB
            const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
            if (!guildSettings || !guildSettings.verifiedRole) {
                return interaction.editReply({ content: '❌ Роль верифицированных пользователей не настроена. Используйте `/setverifiedrole`', ephemeral: true });
            }

            const role = interaction.guild.roles.cache.get(guildSettings.verifiedRole);
            const member = await interaction.guild.members.fetch(discordId);



            if (role && member) {
                await member.roles.add(role);

                // Save user to the database
                await User.create({
                    discordId,
                    username,
                    guildId: interaction.guild.id
                });

                return interaction.editReply({ content: '✅ Ваш аккаунт успешно привязан!', ephemeral: true });
            } else {
                return interaction.editReply({ content: '❌ Не удалось назначить роль.', ephemeral: true });
            }

        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: '❌ Ошибка при получении данных. Попробуйте позже.', ephemeral: true });
        }
    }
};
