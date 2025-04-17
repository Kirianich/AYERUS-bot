const Updater = require('../../utils/updater');
require('dotenv').config();

const cooldowns = new Map(); // Track user cooldowns outside the class

module.exports = {
  customId: 'update_user_data',
  async execute(interaction) {
    const discordId = interaction.user.id;

    // Cooldown check (5 minutes)
    const remaining = cooldowns.get(discordId);
    if (remaining && Date.now() < remaining) {
      const minutesLeft = ((remaining - Date.now()) / 60000).toFixed(1);
      return interaction.reply({ content: `⏳ Подождите ${minutesLeft} мин до следующего обновления.`, ephemeral: true });
    }
    
    const updater = new Updater(process.env.HYPIXEL_API_KEY);
    const result = await updater.updateUser(interaction);
    if (result.error) {
      return interaction.reply({ content: result.error, ephemeral: true });
    } else {
      // Set cooldown for 5 minutes
      cooldowns.set(discordId, Date.now() + 5 * 60 * 1000);
      return interaction.reply({ content: result.success, ephemeral: true });
    }
  }
};
