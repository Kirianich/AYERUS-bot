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
            const {data: playerRes} = await axios.get(`https://api.hypixel.net/player?key=${process.env.HYPIXEL_API_KEY}&name=${username}`);

            if (!playerRes.success || !playerRes.player) {
                console.log("⚠️ No player data found for username:", username);
                return interaction.editReply({ content: '❌ Игрок не найден или ошибка в API'});
            }
            
            const player = playerRes.player;
            const uuid = player.uuid;
            const displayName = player.displayname;
            const networkRank = player.rank || player.monthlyPackageRank || player.newPackageRank || 'NONE';

            const {data: profileRes} = await axios.get(`https://api.hypixel.net/skyblock/profiles?key=${process.env.HYPIXEL_API_KEY}&uuid=${uuid}`);
            console.log("📡 Hypixel API Response:", response.data);
            if (!profileRes.success || !profileRes.profiles) {
                return interaction.editReply({ content: '❌ Не удалось загрузить SkyBlock профили.' });
            }
            
            const mainProfile = profileRes.profiles.find(p => p.selected);
            const memberData = mainProfile?.members?.[uuid];

            if (!mainProfile || !memberData) {
                return interaction.editReply({ content: '❌ Не удалось определить основной SkyBlock профиль.' });
            }

            const skyblockLevel = mainProfile.leveling?.experience || memberData?.leveling?.experience || 0;

            // TEMP: Log raw skills structure for future parsing
            console.log("🧪 Raw skills data:", memberData.experience || {});

            const {data: guildRes} = await axios.get(`https://api.hypixel.net/guild?key=${process.env.HYPIXEL_API_KEY}&player=${uuid}`);

            let guildName = null;
            let guildRank = null;

            if (guildRes.success && guildRes.guild) {
                guildName = guildRes.guild.name;
                const memberInfo = guildRes.guild.members.find(m => m.uuid === uuid);
                guildRank = memberInfo?.rank || 'Member';
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
        }
    }
};
