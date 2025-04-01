const path = require('path');
const fs = require('fs');
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load Commands, Buttons, and Modals
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

const loadFiles = (dir, collection, type) => {
    const fullPath = path.join(__dirname, dir);
    const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.js'));

    for (const file of files) {
        const interaction = require(path.join(fullPath, file));
        if ((type === 'commands' && interaction.data && interaction.execute) ||
            (type !== 'commands' && interaction.customId && interaction.execute)) {
            
            const key = type === 'commands' ? interaction.data.name : interaction.customId;
            collection.set(key, interaction);
            console.log(`✅ Loaded ${type.slice(0, -1)}: ${key}`);
        } else {
            console.warn(`⚠️ ${type.slice(0, -1)} ${file} is missing required properties.`);
        }
    }
};

loadFiles('commands', client.commands, 'commands');
loadFiles('interactions/buttons', client.buttons, 'buttons');
loadFiles('interactions/modals', client.modals, 'modals');

// Handle Interactions Properly
client.on(Events.InteractionCreate, async interaction => {
    try {
        let handler;

        if (interaction.isChatInputCommand()) {
            handler = client.commands.get(interaction.commandName);
        } else if (interaction.isButton()) {
            handler = client.buttons.get(interaction.customId);
        } else if (interaction.isModalSubmit()) {
            handler = client.modals.get(interaction.customId);
        }

        if (!handler) {
            if (!interaction.replied && !interaction.deferred) {
                return interaction.reply({ content: '❌ Interaction not found.', ephemeral: true }).catch(() => {});
            }   
        }

        // **Defer reply before handling long operations**
        await interaction.deferReply({ ephemeral: true });
        
        await handler.execute(interaction);
    } catch (error) {
        console.error('❌ Interaction Error:', error);
    }
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");
});

client.login(process.env.TOKEN);
