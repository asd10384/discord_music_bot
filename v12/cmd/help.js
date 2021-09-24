
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');

const per = new MessageEmbed()
  .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
  .setColor('RED');


module.exports = {
  name: 'help',
  aliases: ['도움말', '명령어'],
  description: '명령어 확인',
  usage: `${process.env.PREFIX}`,
  async run(client = new Client, message = new Message, args = new Array, PREFIX = process.env.PREFIX, user = new User) {
    // ROLE CHECK
    // const checkrole = await db.get(`${message.guildid}.role`) || []; if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r => (checkrole).includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.MSGDELETE)));


    const commands = client.commands;
    let embed = new MessageEmbed()
      .setTitle(`\` ${(message.member && message.member.nickname) ? message.member.nickname : message.member.user.username} \` 명령어`)
      .setDescription(`명령어 [같은 명령어]\n명령어 설명`)
      .setColor('ORANGE');
    commands.forEach((cmd) => {
      embed.addField(
        `**${PREFIX}${cmd.name} [${cmd.aliases ? cmd.aliases : ''}]**`,
        `${cmd.description}`,
        true
      );
    });

    if (args[0]) {
      let t = false;
      commands.forEach((cmd) => {
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
          return user.send(embed2);
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
          return user.send(embed3);
        }
      });
      if (t) {
        return;
      } else {
        return user.send(embed);
      }
    }
    return user.send(embed);
  },
  async dmrun(client = new Client, message = new Message, args = new Array, PREFIX = process.env.PREFIX) {
    const commands = client.commands.array();

    let embed = new MessageEmbed()
      .setTitle(`\` 명령어 \``)
      .setDescription(`명령어 [같은 명령어]\n명령어 설명`)
      .setColor('ORANGE');
    commands.forEach((cmd) => {
      embed.addField(
        `**${PREFIX}${cmd.name} [${cmd.aliases ? cmd.aliases : ''}]**`,
        `${cmd.description}`,
        true
      );
    });

    if (args[0]) {
      let t = false;
      commands.forEach((cmd) => {
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
          return message.channel.send(embed2);
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
          return message.channel.send(embed3);
        }
      });
      if (t) {
        return;
      } else {
        return message.channel.send(embed);
      }
    }
    return message.channel.send(embed);
  }
};

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) { }
  }, t);
}
