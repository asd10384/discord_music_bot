
require('dotenv').config();
const { CommandInteraction } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('따라하기'),
  async execute(interaction = new CommandInteraction) {
    await interaction.reply('따라하기');
  }
};
