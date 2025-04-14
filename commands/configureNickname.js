const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const GuildSettings = require('../../models/GuildSettings');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('configure-nickname')
    .setDescription('Настройка формата автоника и игнорируемых ролей')
    .setDefaultMemberPermissions('0x0000000000000020'), // MANAGE_GUILD

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const settings = await GuildSettings.findOne({ discordGuildId: guildId }) || await GuildSettings.create({ discordGuildId: guildId });

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Настройки автонника')
      .setDescription('Настройте формат ника и роли, при которых он не будет обновляться.')
      .addFields(
        { name: 'Текущий формат ника', value: `\`${settings.nicknameFormat}\`` },
        { name: 'Игнорируемые роли', value: settings.ignoredRoles.length > 0 ? settings.ignoredRoles.map(id => `<@&${id}>`).join(', ') : 'Не задано' }
      )
      .setColor('Blue');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('nickname:edit_format')
        .setLabel('📝 Изменить формат')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('nickname:edit_ignored')
        .setLabel('🚫 Игнорируемые роли')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
  }
};