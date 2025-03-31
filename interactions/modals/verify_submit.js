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
        console.log("🔍 Received interaction for:", interaction.customId);        

        await interaction.deferReply({ ephemeral: true });
        console.log("✅ Interaction deferred");

        try {
            // Check if user is already verified
            const existingUser = await User.findOne({ discordId });
            if (existingUser) {
                return interaction.editReply({ content: '✅ Вы уже верифицированы!'});
            }

            // Call Hypixel API
            const response = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&name=${username}`);
            console.log("📡 Hypixel API Response:", response.data);
            if (!response.data.success) {
                return interaction.editReply({ content: '❌ Ошибка API Hypixel, попробуйте позже.'});
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
                return interaction.editReply({ content: '❌ Нет привязанного аккаунта Discord в профиле игрока на Hypixel.'});
            }

            const discordUsername = interaction.user.username;
            console.log("🔗 Comparing Linked Discord:", linkedDiscord, "with User:", discordUsername);
            if (linkedDiscord !== discordUsername) {
                return interaction.editReply({ 
                content: `❌ Ваш привязанный Discord (${linkedDiscord}) не совпадает с текущим!`});
            }

            // Fetch the verified role from MongoDB
            const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
            if (!guildSettings || !guildSettings.verifiedRole) {
                console.log("⚠️ No verified role set for guild:", interaction.guild.id);
                return interaction.editReply({ content: '❌ Роль верифицированных пользователей не настроена. Используйте `/setverifiedrole`'});
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

                return interaction.editReply({ content: '✅ Ваш аккаунт успешно привязан!'});
            } else {
                return interaction.editReply({ content: '❌ Не удалось назначить роль.'});
            }

        } catch (error) {
             if (interaction.replied || interaction.deferred) {
        await interaction.editReply({ content: '❌ Something went wrong. Try again later.', ephemeral: true });
    } else {
        await interaction.reply({ content: '❌ Something went wrong. Try again later.', ephemeral: true });
    }
        }
    }
};
