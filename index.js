const path = require('path'); // defining path
const commandsPath = path.join(__dirname, 'commands');
const fs = require('fs');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Load Commands handlers
client.commands = new Collection();

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

 // Debugging: Log the loaded command
    console.log(`🔍 Loading command: ${file} ->`, command);

    if (!command || !command.data || !command.data.name) {
        console.error(`❌ Command file '${file}' is missing "data.name"`);
        continue;
    }
    
    client.commands.set(command.data.name, command);
}

// Load Button handlers
client.buttons = new Collection();

const buttonFiles = fs.readdirSync('./interactions/buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
    const button = require(`./interactions/buttons/${file}`);
    client.buttons.set(button.customId, button);
}

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");
});

client.on('interactionCreate', async interaction => {
if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (command) await command.execute(interaction);
    } else if (interaction.isButton()) {
        const button = client.buttons.get(interaction.customId);
        if (button) {
            try {
                await button.execute(interaction);
            } catch (error) {
                console.error(`Error executing button ${interaction.customId}:`, error);
                await interaction.reply({ content: 'There was an error handling this button.', ephemeral: true });
            }
        }
    }
});

client.login(process.env.TOKEN); 
