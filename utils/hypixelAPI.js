const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.HYPIXEL_API_KEY;

async function getPlayerData(ign) {
    try {
        const response = await axios.get(`https://api.hypixel.net/player?key=${API_KEY}&name=${ign}`);
        return response.data.player || null;
    } catch (error) {
        console.error("Error fetching player data:", error.message);
        return null;
    }
}

async function getGuildData(uuid) {
    try {
        const response = await axios.get(`https://api.hypixel.net/guild?key=${API_KEY}&player=${uuid}`);
        return response.data.guild || null;
    } catch (error) {
        console.error("Error fetching guild data:", error.message);
        return null;
    }
}

module.exports = { getPlayerData, getGuildData };