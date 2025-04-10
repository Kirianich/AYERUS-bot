const GuildSettings = require('../../../models/GuildSettings');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { buildInitialSettingsMessage, buildGuildSelectPanel } = require('../../../utils/settingsUI');


const { embed, components } = await buildGuildSelectPanel(settings);
await interaction.update({ embeds: [embed], components });

