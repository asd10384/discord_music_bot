
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message, User } = require('discord.js');
const msg = require('../msg');

const per = new MessageEmbed()
  .setTitle(`이 명령어를 사용할 권한이 없습니다.`)
  .setColor('RED');


module.exports = {
  name: 'create',
  aliases: ['생성'],
  description: '음성채널 생성',
  usage: `${process.env.PREFIX}`,
  async run(client = new Client, message = new Message, args = new Array, PREFIX = process.env.PREFIX, user = new User) {
    // ROLE CHECK
    const checkrole = await db.get(`${message.guildid}.role`) || []; if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r => (checkrole).includes(r.id)))) return message.channel.send(per).then(m => msgdelete(m, Number(process.env.MSGDELETE)));

    message.guild.channels.create(`🎵음악퀴즈 채널`, {
      type: 'text',
      topic: `${PREFIX}help`
    }).then(async c => {
      await db.set(`${message.guildid}.channelid`, c.id);
      c.send(msg.list, msg.embed).then(async (m) => {
        await db.set(`${message.guildid}.massageid`, m.id);
      });
    });
  },
};

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) { }
  }, t);
}
