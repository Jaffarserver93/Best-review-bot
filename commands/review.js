const { SlashCommandBuilder } = require('discord.js');
const Review = require('../models/review');
const UserCooldown = require('../models/userCooldown');
const { checkCooldown } = require('../utils/cooldown');
const { generateReviewId } = require('../utils/generateReviewId');
const GuildSettings = require('../models/guildSettings');
const logger = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('review')
    .setDescription('Submit a review')
    .addIntegerOption(option =>
      option
        .setName('rating')
        .setDescription('Star rating (1-5)')
        .setRequired(true)
        .addChoices(
          { name: '1 Star', value: 1 },
          { name: '2 Stars', value: 2 },
          { name: '3 Stars', value: 3 },
          { name: '4 Stars', value: 4 },
          { name: '5 Stars', value: 5 }
        )
    )
    .addStringOption(option =>
      option
        .setName('description')
        .setDescription('Review description')
        .setRequired(true)
    ),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const rating = interaction.options.getInteger('rating');
    const description = interaction.options.getString('description');

    if (rating < 1 || rating > 5) {
      await interaction.reply({ content: 'Rating must be between 1 and 5 stars.', ephemeral: true });
      return;
    }

    const cooldown = await checkCooldown(userId, guildId, 'review', 24 * 60 * 60 * 1000); // 24-hour cooldown
    if (!cooldown.allowed) {
      await interaction.reply({
        content: `You can submit another review in ${cooldown.remainingTime} hours.`,
        ephemeral: true,
      });
      return;
    }

    const guildSettings = await GuildSettings.findOne({ guildId });
    if (!guildSettings || !guildSettings.reviewChannelId) {
      await interaction.reply({
        content: 'Review channel not set. Ask an admin to use /setreview.',
        ephemeral: true,
      });
      return;
    }

    const reviewId = generateReviewId();
    const review = new Review({
      reviewId,
      userId,
      guildId,
      rating,
      description,
    });
    await review.save();

    const channel = interaction.guild.channels.cache.get(guildSettings.reviewChannelId);
    if (!channel) {
      await interaction.reply({ content: 'Review channel not found.', ephemeral: true });
      return;
    }

    const starEmoji = '⭐'; // You can replace with a custom emoji if available in your server
    const ratingDisplay = `${starEmoji} `.repeat(rating).trim();

    const embed = {
      color: 0xff00ff, // Purple to match the theme
      title: 'New Review!',
      description: description,
      fields: [
        { name: 'Rating', value: `${ratingDisplay} (${rating}/5)`, inline: true },
        { name: 'Reviewed', value: 'a few seconds ago', inline: true },
        { name: 'Review ID', value: reviewId, inline: true },
      ],
      footer: { text: `By ${interaction.user.username}` },
      timestamp: new Date(),
    };

    await channel.send({ embeds: [embed] });
    await interaction.reply({ content: 'Review submitted successfully!', ephemeral: true });
    logger.info(`Review #${reviewId} submitted by ${interaction.user.tag} in guild ${guildId}`);

    // Update bot status with new review count
    const reviewCount = await Review.countDocuments();
    interaction.client.user.setActivity(`Watching: ${reviewCount} Reviews`, { type: ActivityType.Watching });
  },
};
