const { SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const GuildSettings = require('../models/guildSettings');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setreview')
    .setDescription('Set the channel to post reviews in (Admin only)')
    .addChannelOption(option =>
      option
        .setName('channel')
        .setDescription('The channel to post reviews in')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),
  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      await interaction.reply({ content: 'You need Administrator permissions to use this command.', ephemeral: true });
      return;
    }

    const channel = interaction.options.getChannel('channel');
    if (!channel || !channel.isTextBased()) {
      await interaction.reply({ content: 'Please select a valid text channel.', ephemeral: true });
      return;
    }

    await GuildSettings.findOneAndUpdate(
      { guildId: interaction.guild.id },
      { reviewChannelId: channel.id },
      { upsert: true, new: true }
    );

    await interaction.reply({
      content: `Review channel set to ${channel}. Reviews will now be posted here.`,
      ephemeral: true,
    });
    logger.info(`Review channel set to ${channel.id} in guild ${interaction.guild.id} by ${interaction.user.tag}`);
  },
};
