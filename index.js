const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Hypixel = require('hypixel-api-reborn');
require('dotenv').config();


const hypixel = new Hypixel.Client(process.env.HYPIXEL_API_KEY);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Setup collections for commands, buttons, and modals
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Load slash commands
const commandsPath = path.join(__dirname, 'commands');
fs.readdirSync(commandsPath).forEach(file => {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
    }
});

// Load button interactions
const buttonsPath = path.join(__dirname, 'interactions/buttons');
fs.readdirSync(buttonsPath).forEach(file => {
    const button = require(path.join(buttonsPath, file));
    if (button.customId && button.execute) {
        client.buttons.set(button.customId, button);
        console.log(`✅ Loaded button: ${button.customId}`);
    }
});

// Load modal interactions
const modalsPath = path.join(__dirname, 'interactions/modals');
fs.readdirSync(modalsPath).forEach(file => {
    const modal = require(path.join(modalsPath, file));
    if (modal.customId && modal.execute) {
        client.modals.set(modal.customId, modal);
        console.log(`✅ Loaded modal: ${modal.customId}`);
    }
});

// Handle interactions
client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) await command.execute(interaction);
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (button) await button.execute(interaction);
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (modal) await modal.execute(interaction);
        }
    } catch (error) {
        console.error('❌ Interaction Error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: '⚠️ Ошибка обработки взаимодействия!', ephemeral: true }).catch(() => {});
        }
    }
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB");
});

client.login(process.env.TOKEN);
