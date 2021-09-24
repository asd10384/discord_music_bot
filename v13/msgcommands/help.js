
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message } = require('discord.js');

const per = new MessageEmbed()
  .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
  .setColor('RED');

  
module.exports = {
  name: 'help',
  aliases: ['도움말','명령어'],
  description: '도움말 확인',
  usage: `${process.env.PREFIX}help`,
  async run(client = new Client, message = new Message, args = new Array, PREFIX = process.env.PREFIX, commands = new Array) {
    // ROLE CHECK
    // const checkrole = await db.get(`${message.guildid}.role`) || []; if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r => (checkrole).includes(r.id)))) return message.channel.send({ embeds: per }).then(m => msgdelete(m, Number(process.env.MSGDELETE)));

    
    commands = client.commands;
    let embed = new MessageEmbed()
      .setTitle(`\` ${(message.member && message.member.nickname) ? message.member.nickname : message.member.user.username} \` 명령어`)
      .setDescription(`명령어 [같은 명령어]\n명령어 설명`)
      .setColor('ORANGE');
    commands.forEach(async (cmd) => {
      embed.addField(
        `**${PREFIX}${cmd.name} [${cmd.aliases ? cmd.aliases : ''}]**`,
        `${cmd.description}`,
        true
      );
    });

    if (args[0]) {
      let t = false;
      commands.forEach(async (cmd) => {
        if (cmd.name == args[0]) {
          t = true;
          let embed2 = new MessageEmbed()
            .setTitle(`\` ${cmd.name} \` 명령어`)
            .setDescription(`
              이름: ${cmd.name}
              같은명령어: ${cmd.aliases}
              설명: ${cmd.description}
              사용법: ${cmd.usage}
            `)
            .setColor('ORANGE');
          return message.channel.send({ embeds: [embed2] }).then(m => msgdelete(m, 6000*2));
        }
        if (cmd.aliases.indexOf(args[0]) > -1) {
          t = true;
          let embed3 = new MessageEmbed()
            .setTitle(`\` ${cmd.name} \` 명령어`)
            .setDescription(`
              이름: ${cmd.name}
              같은명령어: ${cmd.aliases}
              설명: ${cmd.description}
              사용법: ${cmd.usage}
            `)
            .setColor('ORANGE');
            return message.channel.send({ embeds: [embed3] }).then(m => msgdelete(m, 6000*2));
        }
      });
      if (t) {
        return;
      } else {
        return message.channel.send({ embeds: [embed] }).then(m => msgdelete(m, 6000*2));
      }
    }
    return message.channel.send({ embeds: [embed] }).then(m => msgdelete(m, 6000*2));
  },
};

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) { }
  }, t);
}