const { SlashCommandBuilder } = require('discord.js');
const { getPlayerData } = require('../utils/hypixelAPI');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Привяжите Ваш майнкрафт аккаунт')
        .addStringOption(option =>
            option.setName('ign')
                .setDescription('Ваш ник в майнкрафте')
                .setRequired(true)),

    async execute(interaction) {
        const ign = interaction.options.getString('ign');
        const playerData = await getPlayerData(ign);

        if (!playerData) {
            return interaction.reply({ content: "Неверный ник или игрок не найден.", ephemeral: true });
        }

        const user = await User.findOneAndUpdate(
            { discordId: interaction.user.id },
            { discordId: interaction.user.id, minecraftUUID: playerData.uuid, ign },
            { upsert: true, new: true }
        );

        return interaction.reply({ content: `✅ Привязан аккаунт **${ign}**!`, ephemeral: true });
    }
};
 
