const { SlashCommandBuilder } = require('discord.js');
const { getGuild } = require('hypixel-api-reborn');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link-guild')
        .setDescription('🔗 Привязать Hypixel гильдию к серверу')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Название Hypixel гильдии')
                .setRequired(true)
        ),

    async execute(interaction) {
        const guildName = interaction.options.getString('name');
        await interaction.deferReply({ ephemeral: true });

        try {
            const guild = await getGuild('name', guildName, { key: process.env.HYPIXEL_API_KEY });
            if (!guild || !guild.id || !guild.name || !guild.ranks) {
                return interaction.editReply('❌ Не удалось получить данные гильдии. Убедитесь, что имя указано верно.');
            }

            const update = {
                $push: {
                    linkedGuilds: {
                        hypixelGuildId: guild.id,
                        hypixelGuildName: guild.name,
                        guildRanks: guild.ranks.slice(0,4),
                        roles: {
                            guildMemberRole: null,
                            rankRoles: {
                                rank1: null,
                                rank2: null,
                                rank3: null,
                                rank4: null
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
