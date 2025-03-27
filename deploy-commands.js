const fs = require('fs');
const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs')
require('dotenv').config();


const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    } else {
        console.warn(`[WARNING] The command file '${file}' is missing 'data' or improperly structured.`);
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🚀 Deploying commands...");
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
        console.log("✅ Slash commands deployed successfully!");
    } catch (error) {
        console.error("❌ Error deploying commands:", error);
    }
})();
