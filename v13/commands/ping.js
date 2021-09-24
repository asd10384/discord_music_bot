
require('dotenv').config();
const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('return pong!'),
  async execute(interaction = new CommandInteraction) {
    await interaction.reply({ content: 'pong', ephemeral: true });
  }
};
