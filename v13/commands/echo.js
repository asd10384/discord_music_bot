
require('dotenv').config();
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('echo')
    .setDescription('임베드로 따라하기')
    .addStringOption(option => option.setName('메세지').setDescription('메세지').setRequired(true)),
  async execute(interaction = new CommandInteraction, client = new Client) {
    const msg = interaction.options.getString('메세지');
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor(`${(interaction.member?.nickname) ? interaction.member.nickname : interaction.user.username}`, interaction.user.displayAvatarURL({ dynamic: true }))
          .setDescription(`**${msg}**`)
          .setColor('ORANGE')
      ],
      ephemeral: false
    });
  }
};
