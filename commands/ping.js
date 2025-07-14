const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency'),
  async execute(interaction) {
    const start = Date.now();
    await interaction.reply('Pong!');
    const end = Date.now();
    await interaction.editReply(`Pong! Latency–

System: : ${end - start}ms`);
  },
};
