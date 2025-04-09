const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const Hypixel = require('hypixel-api-reborn');
const { loadFilesRecursively } = require('./utils/loadFilesRecursively');
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
client.selectMenus = new Collection();

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
const buttonFiles = loadFilesRecursively(path.join(__dirname, 'interactions/buttons'));
for (const file of buttonFiles) {
  const button = require(file);
  if (button.customId && button.execute) {
    client.buttons.set(button.customId, button);
  }
}

// Load modal interactions
const modalsPath = path.join(__dirname, 'interactions/modals');
fs.readdirSync(modalsPath).forEach(file => {
    const modal = require(path.join(modalsPath, file));
    if (modal.customId && modal.execute) {
        client.modals.set(modal.customId, modal);
        console.log(`✅ Loaded modal: ${modal.customId}`);
    }
});

// Load select menu interactions
const selectMenuFiles = loadFilesRecursively(path.join(__dirname, 'interactions/selectMenus'));
for (const file of selectMenuFiles) {
  const menu = require(file);
  if (menu.customId && menu.execute) {
    client.selectMenus.set(menu.customId, menu);
  }
}

// Handle interactions
client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) await command.execute(interaction);
        } else if (interaction.isButton()) {
            const button = [...client.buttons.values()].find(b => interaction.customId.startsWith(b.customId));
            if (!button) return;
            await button.execute(interaction);
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (modal) await modal.execute(interaction);
        } else if (interaction.isSelectMenu()) {
            const selectMenu = client.selectMenu.get(interaction.customId);
            if (selectMenu) await modal.execute(interaction);
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
