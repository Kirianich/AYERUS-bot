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

// Handle Interactions Properly
client.on(Events.InteractionCreate, async interaction => {
   try {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            await command.execute(interaction);
        } else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return;
            await button.execute(interaction);
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (!modal) return;
            await modal.execute(interaction);
        }
    } catch (error) {
        console.error('❌ Interaction Error:', error);
    }
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error);
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");
});
try {
client.login(process.env.TOKEN);
} catch (error) {
    console.error
}
