const { Events, DiscordAPIError } = require('discord.js');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../../models/User'); // Schema for storing verified users
const GuildSettings = require('../../models/GuildSettings'); // Stores guild-specific settings
require('dotenv').config();

module.exports = {
    customId: 'verification_modal',
    async execute(interaction) {
        try {
            const username = interaction.fields.getTextInputValue('minecraft_username');
            const discordId = interaction.user.id;
            console.log("🔍 Received interaction for:", interaction.customId);        

            await interaction.deferReply({ ephemeral: true });
            console.log("✅ Interaction deferred");

            // Check if user is already verified
            const existingUser = await User.findOne({ discordId });
            if (existingUser) {
                await interaction.editReply({ content: '✅ Вы уже верифицированы!'});
                return;
            }

            // Call Hypixel API
            const response = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&name=${username}`);
            console.log("📡 Hypixel API Response:", response.data);
            if (!response.data.success) {
                await interaction.editReply({ content: '❌ Ошибка API Hypixel, попробуйте позже.'});
                return;
            }

            const playerData = response.data.player;
            if (!playerData) {
                console.log("⚠️ No player data found for username:", username);
                return interaction.editReply({ content: '❌ Игрок с таким ником не найден на Hypixel!'});
            }

            // Ensure socialMedia exists
            const linkedDiscord = playerData?.socialMedia?.links?.DISCORD;
            if (!linkedDiscord) {
                console.log("⚠️ No linked Discord found for:", username);
                await interaction.editReply({ content: '❌ Нет привязанного аккаунта Discord в профиле игрока на Hypixel.'});
                return;
            }

            const discordUsername = interaction.user.username;
            console.log("🔗 Comparing Linked Discord:", linkedDiscord, "with User:", discordUsername);
            if (linkedDiscord !== discordUsername) {
                await interaction.editReply({ content: `❌ Ваш привязанный Discord (${linkedDiscord}) не совпадает с текущим!`});
                return;
            }

            // Fetch the verified role from MongoDB
            const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
            if (!guildSettings || !guildSettings.verifiedRole) {
                console.log("⚠️ No verified role set for guild:", interaction.guild.id);
                await interaction.editReply({ content: '❌ Роль верифицированных пользователей не настроена. Используйте `/setverifiedrole`'});
                return;
            }

            const role = interaction.guild.roles.cache.get(guildSettings.verifiedRole);
            const member = await interaction.guild.members.fetch(discordId);

            console.log("🔍 Fetched Role:", role ? "✅ Found" : "❌ Not Found");
            console.log("🔍 Fetched Member:", member ? "✅ Found" : "❌ Not Found");

            if (role && member) {
                await member.roles.add(role);

                // Save user to the database
                await User.create({
                    discordId,
                    username,
                    guildId: interaction.guild.id
                });

                await interaction.editReply({ content: '✅ Ваш аккаунт успешно привязан!'});
            } else {
                await interaction.editReply({ content: '❌ Не удалось назначить роль.'});
                return;
            }

        } catch (error) {
            console.error("❌ Error in verification:", error);
            if (interaction.deferred) {
                await interaction.editReply({ content: '❌ Something went wrong. Try again later.', ephemeral: true });
            }
        }
    }
};
