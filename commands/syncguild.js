const { SlashCommandBuilder } = require('discord.js');
const { getGuildData } = require('../utils/hypixelAPI');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('syncguild')
        .setDescription('Sync your Hypixel Guild rank with Discord roles'),

    async execute(interaction) {
        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user) {
            return interaction.reply({ content: "You need to verify first using `/verify`.", ephemeral: true });
        }

        const guildData = await getGuildData(user.minecraftUUID);
        if (!guildData) {
            return interaction.reply({ content: "You are not in a Hypixel guild.", ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(interaction.user.id);
        const roleName = guildData.ranks.find(rank => rank.name === user.guildRank)?.name || "Member";
        const role = interaction.guild.roles.cache.find(r => r.name === roleName);

        if (role) {
            await member.roles.add(role);
            return interaction.reply({ content: `✅ Assigned role: **${roleName}**`, ephemeral: true });
        } else {
            return interaction.reply({ content: "❌ Guild role not found in this server.", ephemeral: true });
        }
    }
}; 
