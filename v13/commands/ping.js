
require('dotenv').config();
const { CommandInteraction, Client, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('return pong!'),
  async execute(interaction = new CommandInteraction, client = new Client) {
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(`\` PONG! \``)
          .setDescription(`🏓 \` ${client.ws.ping} \` ms`)
          .setColor('ORANGE')
      ],
      ephemeral: true
    });
  }
};
