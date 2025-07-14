const { SlashCommandBuilder } = require('discord.js');
const Review = require('../models/review');
const logger = require('../utils/logger');
const process = require('process');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botinfo')
    .setDescription('Displays information about the bot'),
  async execute(interaction) {
    const botTag = interaction.client.user.tag;
    const botId = interaction.client.user.id;
    const createdAt = interaction.client.user.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const uptimeMinutes = Math.floor(interaction.client.uptime / (1000 * 60));
    const totalReviews = await Review.countDocuments({ guildId: interaction.guild.id });
    const reviews = await Review.find({ guildId: interaction.guild.id });
    const averageRating = reviews.length ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0;
    const serverCount = interaction.client.guilds.cache.size;
    const userCount = interaction.client.users.cache.size; // Approximate; actual unique users require more tracking

    const memoryUsage = process.memoryUsage();
    const memoryMb = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memoryTotalMb = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);

    const embed = {
      color: 0xff00ff, // Purple to match the theme
      title: `:2.: Hydra Reviews Bot Info`,
      fields: [
        {
          name: 'Bot Overview',
          value: [
            `• Tag: ${botTag}`,
            `• Review: JXFRCloud Review#4509`, // Hardcoded for now; adjust as needed
            `• ID: ${botId}`,
            `• Created: ${createdAt}`,
            `• Online Since: ${uptimeMinutes} minutes ago`
          ].join('\n'),
        },
        {
          name: 'Review Stats',
          value: [
            `• Total Reviews: ${totalReviews}`,
            `• Average Rating: ${averageRating}/5`,
            `• Servers: ${serverCount}`,
            `• Users: ${userCount}`
          ].join('\n'),
        },
        {
          name: 'System Info',
          value: [
            `• Memory Usage: ${memoryMb} MB / ${memoryTotalMb} MB`,
            `• CPU Cores: 0`, // Requires os-utils for accurate data
            `• Node.js: v${process.version}`,
            `• Discord.js: v14.21.0` // Match the version in package.json
          ].join('\n'),
        },
      ],
      footer: { text: `Requested by ${interaction.user.tag} | Today at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}` },
    };

    await interaction.reply({ embeds: [embed] });
    logger.info(`Bot info requested by ${interaction.user.tag} in guild ${interaction.guild.id}`);
  },
};
