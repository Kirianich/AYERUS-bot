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

        try {
            const username = interaction.fields.getTextInputValue('minecraft_username');
            const discordId = interaction.user.id;
            console.log("🔍 Received interaction for:", interaction.customId);
        
            // Check if user is already verified
            const existingUser = await User.findOne({ discordId });
            if (existingUser) {
                await interaction.editReply({ content: '✅ Вы уже верифицированы!'});
                return;
            }

            // Call Hypixel API
            const response = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&name=${username}`);

            const playerData = response.data.player;
            if (!playerData) {
                console.log("⚠️ No player data found for username:", username);
                return interaction.editReply({ content: '❌ Игрок с таким ником не найден на Hypixel!'});
            }

            const guildResponse = await axios.get(`https://api.hypixel.net/guild?key=${process.env.HYPIXEL_API_KEY}&player=${playerData.uuid}`);
            const sbProfilesResponse = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${process.env.HYPIXEL_API_KEY}&uuid=${playerData.uuid}`);
            console.log("📡 Hypixel API Response:", response.data);
            if (!response.data.success || !guildResponse.data.success || !sbProfilesResponse.data.success) {
                await interaction.editReply({ content: '❌ Ошибка API Hypixel, попробуйте позже.'});
                return;
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

            // Fetch Hypixel rank
            let rank = playerData.rank || playerData.newPackageRank || playerData.monthlyPackageRank || "Default";

            // Fetch Hypixel Guild Data
            let hypixelGuild = "None";
            let guildRank = "Member";
            if (guildResponse.data.success && guildResponse.data.guild) {
                hypixelGuild = guildResponse.data.guild.name;
                const member = guildResponse.data.guild.members.find(m => m.uuid === playerData.uuid);
                guildRank = member?.rank || "Member";
            }

            // Fetch Skyblock Profile
            let skyblockLevel = 0;
            let skyblockSkills = {};

            if (sbProfilesResponse.data.success && sbProfilesResponse.data.profiles) {
                // Find the main profile
                const mainProfile = sbProfilesResponse.data.profiles.find(profile => profile.selected);
                if (mainProfile) {
                    const profileData = mainProfile.members[playerData.uuid];
                    
                    // Extract Skyblock Level
                    skyblockLevel = profileData?.leveling?.experience || 0;
                    
                    // Extract Skyblock Skills
                    const skills = profileData?.experience || {};
                    const skillNames = {
                        farming: "Farming",
                        mining: "Mining",
                        combat: "Combat",
                        foraging: "Foraging",
                        fishing: "Fishing",
                        enchanting: "Enchanting",
                        alchemy: "Alchemy",
                        taming: "Taming",
                        carpentry: "Carpentry",
                        runecrafting: "Runecrafting"
                    };

                    for (const skill in skillNames) {
                        skyblockSkills[skillNames[skill]] = Math.floor((skills[skill] || 0) / 1000); // Convert XP to level
                    }
                }
            }

            const role = interaction.guild.roles.cache.get(guildSettings.verifiedRole);
            console.log("🔍 Fetched Role:", role ? "✅ Found" : "❌ Not Found");
            const member = await interaction.guild.members.fetch(discordId);
            console.log("🔍 Fetched Member:", member ? "✅ Found" : "❌ Not Found");

            if (role && member) {
                await member.roles.add(role);
                // Save user to the database
                await User.create({
                    discordId,
                    username,
                    guildId: interaction.guild.id,
                    hypixelGuild,
                    guildRank,
                    networkRank: rank,
                    skyblockLevel,
                    skyblockSkills
                });

                return interaction.editReply({ content: '✅ Ваш аккаунт успешно привязан!'});
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
