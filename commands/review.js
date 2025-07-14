const { SlashCommandBuilder } = require('discord.js');
const Review = require('../models/review');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('useful')
    .setDescription('Mark a review as useful')
    .addStringOption(option =>
      option
        .setName('reviewid')
        .setDescription('The review ID to mark as useful')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const reviewId = interaction.options.getString('reviewid');
    const review = await Review.findOne({ reviewId, guildId: interaction.guild.id });

    if (!review) {
      await interaction.reply({ content: 'Review not found.', ephemeral: true });
      return;
    }

    if (review.usefulUsers.includes(userId)) {
      await interaction.reply({ content: 'You have already marked this review as useful.', ephemeral: true });
      return;
    }

    review.usefulCount += 1;
    review.usefulUsers.push(userId);
    await review.save();

    await interaction.reply({
      content: `Review #${reviewId} marked as useful! Total useful votes: ${review.usefulCount}`,
      ephemeral: true,
    });
    logger.info(`User ${userId} marked review #${reviewId} as useful in guild ${interaction.guild.id}`);
  },
};
