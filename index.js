const path = require('path');
const fs = require('fs');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const mongoose = require('mongoose');
const { Client } = require('hypixel-api-reborn');
client.hypixel = new Client(process.env.HYPIXEL_API_KEY);
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();

// Recursive loader
function loadHandlers(folder, collection) {
    const items = fs.readdirSync(folder);
    for (const item of items) {
        const fullPath = path.join(folder, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            loadHandlers(fullPath, collection);
        } else if (item.endsWith('.js')) {
            const handler = require(fullPath);
            if ((handler.data || handler.customId) && handler.execute) {
                const key = handler.data?.name || handler.customId;
                collection.set(key, handler);
                console.log(`✅ Loaded ${key}`);
            }
        }
    }
}

loadHandlers(path.join(__dirname, 'commands'), client.commands);
loadHandlers(path.join(__dirname, 'interactions/buttons'), client.buttons);
loadHandlers(path.join(__dirname, 'interactions/modals'), client.modals);
loadHandlers(path.join(__dirname, 'interactions/selectMenus'), client.selectMenus);

client.on('interactionCreate', async interaction => {
    try {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (command) await command.execute(interaction);
        } else if (interaction.isButton()) {
            const button = [...client.buttons.values()].find(b => {
                if (typeof b.customId === 'string') {
                    return interaction.customId.startsWith(b.customId);
                } else if (b.customId instanceof RegExp) {
                    return b.customId.test(interaction.customId);
                }
                return false;
            });
            if (button) await button.execute(interaction);
        } else if (interaction.isModalSubmit()) {
            const modal = client.modals.get(interaction.customId);
            if (modal) await modal.execute(interaction);
        } else if (interaction.isRoleSelectMenu()) {
            const menu = [...client.selectMenus.values()].find(m => {
        if (typeof m.customId === 'string') {
            return interaction.customId === m.customId;
        } else if (m.customId instanceof RegExp) {
            return m.customId.test(interaction.customId);
        }
        return false;
    });
            if (menu) await menu.execute(interaction);
        }
    } catch (error) {
        console.error('❌ Interaction Error:', error);
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({ content: '⚠️ Произошла ошибка при обработке взаимодействия.', ephemeral: true }).catch(() => {});
        }
    }
});

client.once('ready', async () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
});

client.login(process.env.TOKEN);
