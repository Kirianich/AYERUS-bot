const { Events } = require('discord.js');
const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../../models/User'); // Schema for storing verified users
const GuildSettings = require('../../models/GuildSettings'); // Stores guild-specific settings
require('dotenv').config();

module.exports = {
    customId: 'verification_modal',
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        console.log("✅ Interaction deferred");
        const username = interaction.fields.getTextInputValue('minecraft_username');
        const discordId = interaction.user.id;
        console.log("🔍 Received interaction for:", interaction.customId);        

        try {
            // Check if user is already verified
            const existingUser = await User.findOne({ discordId });
            if (existingUser) {
                return interaction.editReply({ content: '✅ Вы уже верифицированы!' });
            }

            // Call Hypixel API to fetch player data
            console.log("📡 Requesting player data from Hypixel API...");
            const playerResponse = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&name=${username}`);
            const playerData = playerResponse.data.player;

            if (!playerResponse.data.success || !playerData) {
                return interaction.editReply({ content: '❌ Игрок с таким ником не найден на Hypixel или ошибка API.' });
            }

            // Check if Discord is linked in Hypixel profile
            const linkedDiscord = playerData?.socialMedia?.links?.DISCORD;
            console.log("🔗 Linked Discord:", linkedDiscord);
            const discordUsername = interaction.user.username;

            if (!linkedDiscord || linkedDiscord !== discordUsername) {
                return interaction.editReply({ content: `❌ Ваш привязанный Discord (${linkedDiscord || 'не указан'}) не совпадает с текущим!` });
            }

            // Fetch verified role from DB
            const guildSettings = await GuildSettings.findOne({ guildId: interaction.guild.id });
            if (!guildSettings || !guildSettings.verifiedRole) {
                return interaction.editReply({ content: '❌ Роль верифицированных пользователей не настроена. Используйте `/setverifiedrole`' });
            }

            const role = interaction.guild.roles.cache.get(guildSettings.verifiedRole);
            const member = await interaction.guild.members.fetch(discordId);

            // Optional: Request guild info
            console.log("📡 Requesting guild data from Hypixel API...");
            const guildResponse = await axios.get(`https://api.hypixel.net/guild?key=${process.env.HYPIXEL_API_KEY}&player=${playerData.uuid}`);
            const guildInfo = guildResponse.data.guild;

            // Save user data to database
            await User.create({
                discordId,
                username,
                guildId: interaction.guild.id,
                hypixelUuid: playerData.uuid,
                hypixelRank: playerData.rank || playerData.newPackageRank || "NONE",
                hypixelGuild: guildInfo?.name || "None",
                hypixelGuildRank: guildInfo?.members?.find(m => m.uuid === playerData.uuid)?.rank || "None"
            });

            if (role && member) {
                await member.roles.add(role);
                return interaction.editReply({ content: '✅ Ваш аккаунт успешно привязан!' });
            } else {
                return interaction.editReply({ content: '❌ Не удалось назначить роль.' });
            }
        } catch (error) {
            console.error("❌ Error during verification:", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: '❌ Что-то пошло не так. Попробуйте позже.' });
            } else {
                await interaction.reply({ content: '❌ Что-то пошло не так. Попробуйте позже.', ephemeral: true });
            }
        }
    }
};
