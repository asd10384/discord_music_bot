
require('dotenv').config();
const db = require('quick.db');
const { readdirSync } = require('fs');
const { CommandInteraction, Collection } = require('discord.js');

// 명령어 불러오기
const commands = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`../commands/${file}`);
  commands.set(command.data.name, command);
}

module.exports = {
  name: 'interactionCreate',
  execute(interaction = new CommandInteraction) {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);
    if (command) {
      command.execute(interaction);
    }
  }
};
