const Verifier = require('../../utils/Verifier');
require('dotenv').config();

module.exports = {
  customId: 'verification_modal',
  async execute(interaction) {
    const username = interaction.fields.getTextInputValue('minecraft_username');
    const verifier = new Verifier(process.env.HYPIXEL_API_KEY);

    await interaction.deferReply({ ephemeral: true });

    const result = await verifier.verifyUser(interaction, username);
    if (result.error) {
      return interaction.editReply({ content: result.error });
    } else {
      return interaction.editReply({ content: result.success });
    }
  }
};
