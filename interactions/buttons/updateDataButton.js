const Updater = require('../../utils/updater');
require('dotenv').config();

module.exports = {
  customId: 'update_user_data',
  async execute(interaction) {
    const updater = new Updater(process.env.HYPIXEL_API_KEY);

    const result = await updater.updateUser(interaction);
    if (result.error) {
      return interaction.editReply({ content: result.error });
    } else {
      return interaction.editReply({ content: result.success });
    }
  }
};
