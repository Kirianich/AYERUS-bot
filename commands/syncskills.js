const { SlashCommandBuilder } = require('discord.js');
const { getSkyblockSkills } = require('../utils/hypixelAPI');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('syncskills')
        .setDescription('Sync your SkyBlock skill roles'),

    async execute(interaction) {
        const user = await User.findOne({ discordId: interaction.user.id });
        if (!user) {
            return interaction.reply({ content: "You need to verify first using `/verify`.", ephemeral: true });
        }

        const skills = await getSkyblockSkills(user.minecraftUUID);
        if (!skills) {
            return interaction.reply({ content: "Failed to fetch SkyBlock skills.", ephemeral: true });
        }

        const member = interaction.guild.members.cache.get(interaction.user.id);
        const skillRoles = {
            "Combat": "Combat 50+",
            "Mining": "Mining 50+",
            "Farming": "Farming 50+"
        };

        for (let skill in skills) {
            let level = Math.floor(skills[skill] / 1000000);
            let roleName = skillRoles[skill];
            let role = interaction.guild.roles.cache.find(r => r.name === roleName);

            if (role && level >= 50) {
                await member.roles.add(role);
            }
        }

        return interaction.reply({ content: "✅ Skills synced!", ephemeral: true });
    }
}; 
