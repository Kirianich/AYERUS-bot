const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const GuildSettings = require('../models/GuildSettings');
const hypixel = new Hypixel.Client(process.env.HYPIXEL_API_KEY);


module.exports = {
    data: new SlashCommandBuilder()
        .setName('link-guild')
        .setDescription('🔗 Привязать Hypixel гильдию к серверу')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название Hypixel гильдии')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply({
                content: '🚫 У вас недостаточно прав для использования этой команды.',
                ephemeral: true
            });
        }

        const guildName = interaction.options.getString('name');
        await interaction.deferReply({ ephemeral: true });

        try {
            const guild = await hypixel.getGuild('name', guildName);
            if (!guild || !guild.id || !guild.name || !guild.ranks) {
                return interaction.editReply('❌ Не удалось получить данные гильдии. Убедитесь, что имя указано верно.');
            }

            const update = {
                $push: {
                    linkedGuilds: {
                        hypixelGuildId: guild.id,
                        hypixelGuildName: guild.name,
                        guildRanks: guild.ranks.map(rank => rank.name).slice(0, 5),
                        roles: {
                            guildMemberRole: null,
                            rankRoles: {
                                rank1: null,
                                rank2: null,
                                rank3: null,
                                rank4: null,
                                rank5: null
                            }
                        }
                    }
                }
            };

            await GuildSettings.findOneAndUpdate(
                { discordGuildId: interaction.guild.id },
                update,
                { upsert: true }
            );

            return interaction.editReply(`✅ Гильдия **${guild.name}** успешно привязана к серверу!`);
        } catch (err) {
            console.error(err);
            return interaction.editReply('❌ Произошла ошибка при привязке гильдии.');
        }
    }
};
