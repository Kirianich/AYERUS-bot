const path = require('path'); // defining path
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
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

// Load Commands handlers
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));


for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data && command.execute) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.warn(`⚠️ Command ${file} is missing "data" or "execute" property.`);
    }
}

const buttonsPath = path.join(__dirname, 'interactions/buttons');
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith('.js'));

for (const file of buttonFiles) {
    const button = require(path.join(buttonsPath, file));
    if (button.customId && button.execute) {
        client.buttons.set(button.customId, button);
        console.log(`✅ Loaded button: ${button.customId}`);
    } else {
        console.warn(`⚠️ Button ${file} is missing "customId" or "execute" property.`);
    }
}

const modalsPath = path.join(__dirname, 'interactions/modals');
const modalFiles = fs.readdirSync(modalsPath).filter(file => file.endsWith('.js'));

for (const file of modalFiles) {
    const modal = require(path.join(modalsPath, file));
    if (modal.customId && modal.execute) {
        client.modals.set(modal.customId, modal);
        console.log(`✅ Loaded modal: ${modal.customId}`);
    } else {
        console.warn(`⚠️ Modal ${file} is missing "customId" or "execute" property.`);
    }
}

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;

            await command.execute(interaction);
        }

        else if (interaction.isButton()) {
            const button = client.buttons.get(interaction.customId);
            if (!button) return interaction.reply({ content: '❌ Button interaction not found.', ephemeral: true });

            await button.execute(interaction);
        }

        else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (!modal) return interaction.reply({ content: '❌ Modal interaction not found.', ephemeral: true });

            await modal.execute(interaction);
        }
    } catch (error) {
            console.error('❌ Interaction Error:', error);
            interaction.reply({ content: '⚠️ Ошибка обработки взаимодействия!', ephemeral: true }).catch(() => {});
        }
    });

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");
});

client.login(process.env.TOKEN); 
