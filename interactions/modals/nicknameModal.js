const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  customId: 'nickname_modal',
  async execute(interaction) {
    const newFormat = interaction.fields.getTextInputValue('nickname_format_input');
    const guildId = interaction.guild.id;

    await GuildSettings.findOneAndUpdate(
      { discordGuildId: guildId },
      { nicknameFormat: newFormat },
      { upsert: true }
    );

    await interaction.reply({
      content: `✅ Формат ника обновлён на: \`${newFormat}\``,
      ephemeral: true
    });
  }
};
