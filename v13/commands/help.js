
require('dotenv').config();
const { Client, CommandInteraction, MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('도움말, 명령어 설명')
    .addStringOption(option => option.setName('명령어').setDescription('명령어를 입력하여 더 자세한 정보를 볼수있음').setRequired(false)),
  async execute(interaction = new CommandInteraction, client = new Client) {
    const cmdmsg = interaction.options.getString('명령어');
    const PREFIX = client.PREFIX;
    
    if (cmdmsg) {
      var cmd = client.commands.get(cmdmsg);
      if (cmd) {
        return await interaction.reply({ embeds: [embed({ data: cmd.data })], ephemeral: true });
      }
      cmd = client.msgcommands.get(cmdmsg);
      if (cmd) {
        return await interaction.reply({ embeds: [embed({ cmd: cmd })], ephemeral: true });
      }
      return await interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle(`\` ${cmdmsg} \` 명령어`)
            .setDescription(`
              **${cmdmsg}** 명령어는 없는 명령어 입니다.

              /help 로 명령어를 확인하세요.
            `)
            .setColor('DARK_RED')
        ],
        ephemeral: true
      });
    } else {
      let helpem = new MessageEmbed()
        .setTitle(`\` 기본 \` 명령어`)
        .setDescription(`명령어 [같은 명령어]\n명령어 설명`)
        .setFooter(`PREFIX: ${PREFIX}`)
        .setColor('ORANGE');
      let helpem2 = new MessageEmbed()
        .setTitle(`\` / \` 명령어`)
        .setDescription(`명령어\n명령어 설명`)
        .setFooter(`PREFIX: /`)
        .setColor('ORANGE');
      
      client.msgcommands.forEach(async (cmd) => {
        helpem.addField(
          `**${PREFIX}${cmd.name} ${(cmd.aliases[0]) ? `[${cmd.aliases}]` : ''}**`,
          `${cmd.description}`,
          true
        );
      });
      client.commands.forEach(async (cmd) => {
        helpem2.addField(
          `**/${cmd.data.name}**`,
          `${cmd.data.description}`,
          true
        );
      });
      return await interaction.reply({ embeds: [helpem, helpem2], ephemeral: true });
    }
  }
};

function embed(cmd = { cmd: { name: new String, aliases: new Array, description: new String, usage: new String }, data: { name: new String, description: new String } }) {
  if (cmd.data) {
    return new MessageEmbed()
      .setTitle(`\` ${cmd.data.name} \` 명령어`)
      .setDescription(`
        이름: ${cmd.data.name}
        설명: ${cmd.data.description}
        사용법: /${cmd.data.name}
      `)
      .setColor('ORANGE');
  } else {
    return new MessageEmbed()
      .setTitle(`\` ${cmd.cmd.name} \` 명령어`)
      .setDescription(`
        이름: ${cmd.cmd.name}
        같은명령어: ${cmd.cmd.aliases}
        설명: ${cmd.cmd.description}
        사용법: ${cmd.cmd.usage}
      `)
      .setColor('ORANGE');
  }
}
