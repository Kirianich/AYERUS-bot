const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-verification')
        .setDescription('Send a verification message to a specific channel')
        .addChannelOption(option => 
            option.setName('channel')
                .setDescription('The channel to send the verification message')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)) {
            return interaction.reply ({
                content: '🚫 У вас недостаточно прав для выполнения этой команды.', ephemeral: true
            });
        }
        const channel = interaction.options.getChannel('channel');

        // Create the embed message
        const embed = new EmbedBuilder()
            .setTitle('🔒 Привязать аккаунт')
            .setDescription('Нажмите на кнопку снизу, чтобы привязать Ваш Майнкрафт аккаунт.')
            .setColor(0x5865F2);

        // Create buttons
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('verify_button')
                .setLabel('✅ Привязать')
                .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
                .setCustomId('howto_button')
                .setLabel('📖 Помощь')
                .setStyle(ButtonStyle.Secondary)
        );

        // Send the embed with buttons
        try {
            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `✅ Verification message sent to ${channel}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: `❌ Failed to send message to ${channel}`, ephemeral: true });
        };
