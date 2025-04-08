const axios = require('axios');
const User = require('../../models/User');
const GuildSettings = require('../../models/GuildSettings');
require('dotenv').config();

module.exports = {
    customId: 'verification_modal',
    async execute(interaction) {
        const username = interaction.fields.getTextInputValue('minecraft_username');
        const discordId = interaction.user.id;
        const discordUsername = interaction.user.username;
        const guildId = interaction.guild.id;

        console.log("🔍 Received interaction for:", interaction.customId);

        await interaction.deferReply({ ephemeral: true });
        console.log("✅ Interaction deferred");

        try {
            const existingUser = await User.findOne({ discordId });
            if (existingUser) {
                return interaction.editReply({ content: '✅ Вы уже верифицированы!' });
            }

            // Step 1: Fetch player data
            const { data: playerRes } = await axios.get('https://api.hypixel.net/player', {
                params: {
                    key: process.env.HYPIXEL_API_KEY,
                    name: username
                }
            });

            if (!playerRes.success || !playerRes.player) {
                return interaction.editReply({ content: '❌ Игрок не найден или API ответило с ошибкой.' });
            }

            const player = playerRes.player;
            const uuid = player.uuid;
            const displayName = player.displayname;
            const networkRank = player.rank || player.monthlyPackageRank || player.newPackageRank || 'NONE';
            const linkedDiscord = player?.socialMedia?.links?.DISCORD;

            console.log("🎮 UUID:", uuid);
            console.log("🔗 Linked Discord:", linkedDiscord);
            console.log("🏷️ Display Name:", displayName);
            console.log("🌐 Network Rank:", networkRank);

            if (!linkedDiscord || linkedDiscord !== discordUsername) {
                return interaction.editReply({ content: `❌ Ваш привязанный Discord (${linkedDiscord}) не совпадает с текущим!` });
            }

            // Step 2: Fetch SkyBlock profiles
            const { data: profileRes } = await axios.get('https://api.hypixel.net/skyblock/profiles', {
                params: {
                    key: process.env.HYPIXEL_API_KEY,
                    uuid
                }
            });

            if (!profileRes.success || !profileRes.profiles) {
                return interaction.editReply({ content: '❌ Не удалось загрузить SkyBlock профили.' });
            }

            const mainProfile = profileRes.profiles.find(p => p.selected);
            const memberData = mainProfile?.members?.[uuid];

            if (!mainProfile || !memberData) {
                return interaction.editReply({ content: '❌ Не удалось определить основной SkyBlock профиль.' });
            }

            const skyblockLevel = mainProfile.leveling?.experience || memberData?.leveling?.experience || 0;
            console.log("📈 SkyBlock Level XP:", skyblockLevel);
            console.log("🧪 Raw Skills Data:", memberData.experience || {});

            // Step 3: Fetch guild info
            const { data: guildRes } = await axios.get('https://api.hypixel.net/guild', {
                params: {
                    key: process.env.HYPIXEL_API_KEY,
                    player: uuid
                }
            });

            let guildName = null;
            let guildRank = null;

            if (guildRes.success && guildRes.guild) {
                guildName = guildRes.guild.name;
                const memberInfo = guildRes.guild.members.find(m => m.uuid === uuid);
                guildRank = memberInfo?.rank || 'Member';
                console.log("🏰 Guild Name:", guildName);
                console.log("📛 Guild Rank:", guildRank);
            }

            // Fetch verified role
            const guildSettings = await GuildSettings.findOne({ guildId });
            if (!guildSettings || !guildSettings.verifiedRole) {
                return interaction.editReply({ content: '❌ Роль верифицированных пользователей не настроена. Используйте `/setverifiedrole`' });
            }

            const role = interaction.guild.roles.cache.get(guildSettings.verifiedRole);
            const member = await interaction.guild.members.fetch(discordId);

            if (role && member) {
                await member.roles.add(role);

                // Save user
                await User.create({
                    discordId,
                    username,
                    guildId,
                    uuid,
                    displayName,
                    networkRank,
                    skyblockLevel,
                    guildName,
                    guildRank
                });

                return interaction.editReply({ content: '✅ Ваш аккаунт успешно привязан!' });
            } else {
                return interaction.editReply({ content: '❌ Не удалось назначить роль.' });
            }
        } catch (error) {
            console.error("❌ Ошибка во время верификации:", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.editReply({ content: '❌ Что-то пошло не так. Попробуйте позже.' });
            } else {
                await interaction.reply({ content: '❌ Что-то пошло не так. Попробуйте позже.' });
            }
        }
    }
};
