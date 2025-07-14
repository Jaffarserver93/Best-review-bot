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
    const userCount = interaction.client.users.cache.size;

    const memoryUsage = process.memoryUsage();
    const memoryMb = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const memoryTotalMb = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);

    const embed = {
      color: 0xff00ff,
      title: `<:emoji_83:1394044953277239436> JXFRCloud Reviews Bot Info`,
      thumbnail: {
        url: interaction.guild.iconURL() || '', // Use server logo as thumbnail
      },
      fields: [
        {
          name: '<a:rules_book:1393638717968748579> Bot Overview',
          value: [
            `- **Tag:**  ${botTag} JXFRCloud Review#4509`, // Added comma here
            `- **ID:** ${botId}`,
            `- **Created:** ${createdAt}`,
            `- **Online Since:** ${uptimeMinutes} minutes ago`
          ].join('\n'),
        },
        {
          name: '<:rfemoji:1394206641435443391> Review Stats',
          value: [
            `- **Total Reviews:** ${totalReviews}`,
            `- **Average Rating:** ${averageRating}/5`,
            `- **Servers:** ${serverCount}`,
            `- **Users:** ${userCount}`
          ].join('\n'),
        },
        {
          name: '<:disk:1393638734666404064> System Info',
          value: [
            `- **Memory Usage:** ${memoryMb} MB / ${memoryTotalMb} MB`,
            `- **CPU Cores:** 0`,
            `- **Node.js:** v${process.version}`,
            `- **Discord.js:** v14.21.0`
          ].join('\n'),
        },
      ],
      footer: {
        text: `Requested by ${interaction.user.username} | Today at ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}`,
        icon_url: interaction.user.displayAvatarURL({ dynamic: true }),
      },
    };

    await interaction.reply({ embeds: [embed] });
    logger.info(`Bot info requested by ${interaction.user.tag} in guild ${interaction.guild.id}`);
  },
};
