
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message } = require('discord.js');

module.exports = {
  name: 'help',
  aliases: ['도움말','명령어'],
  description: '도움말 확인',
  usage: `${process.env.PREFIX}help`,
  async run(client = new Client, message = new Message, args = new Array, PREFIX = process.env.PREFIX, commands = new Array, msgcommands = new Array) {
    // ROLE CHECK
    // const checkrole = await db.get(`${message.guildid}.role`) || []; if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r => (checkrole).includes(r.id)))) return message.channel.send({ embeds: [new MessageEmbed().setTitle(`이 명령어를 사용할 권한이 없습니다.`).setColor('RED')] }).then(m => msgdelete(m, Number(process.env.MSGDELETE)));

    if (args[0]) {
      commands.forEach(async (cmd) => {
        if (cmd.name == args[0]) {
          return message.channel.send({ embeds: [embed({ data: cmd })] }).then(m => msgdelete(m, 6000*2));
        }
      });
      msgcommands.forEach(async (cmd) => {
        if (cmd.name == args[0]) {
          return message.channel.send({ embeds: [embed({ cmd: cmd })] }).then(m => msgdelete(m, 6000*2));
        }
        if (cmd.aliases.indexOf(args[0]) > -1) {
          return message.channel.send({ embeds: [embed({ cmd: cmd })] }).then(m => msgdelete(m, 6000*2));
        }
      });
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`\` ${args[0]} \` 명령어`)
            .setDescription(`
              **${args[0]}** 명령어는 없는 명령어 입니다.

              ${PREFIX}help 로 명령어를 확인하세요.
            `)
            .setColor('DARK_RED')
        ]
      }).then(m => msgdelete(m, 6000));
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
      
      msgcommands.forEach(async (cmd) => {
        helpem.addField(
          `**${PREFIX}${cmd.name} ${(cmd.aliases[0]) ? `[${cmd.aliases}]` : ''}**`,
          `${cmd.description}`,
          true
        );
      });
      commands.forEach(async (cmd) => {
        helpem2.addField(
          `**/${cmd.name}**`,
          `${cmd.description}`,
          true
        );
      });
      return message.channel.send({ embeds: [helpem, helpem2] }).then(m => msgdelete(m, 6000*2));
    }
  },
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

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) { }
  }, t);
}