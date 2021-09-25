
require('dotenv').config();
const db = require('quick.db');
const { MessageEmbed, Client, Message } = require('discord.js');
  
module.exports = {
  name: '핑',
  aliases: [],
  description: 'PONG!',
  usage: `${process.env.PREFIX}`,
  async run(client = new Client, message = new Message, args = new Array, PREFIX = process.env.PREFIX, commands = new Array, msgcommands = new Array) {
    // ROLE CHECK
    // const checkrole = await db.get(`${message.guildid}.role`) || []; if (!(message.member.permissions.has('ADMINISTRATOR') || message.member.roles.cache.some(r => (checkrole).includes(r.id)))) return message.channel.send({ embeds: [new MessageEmbed().setTitle(`이 명령어를 사용할 권한이 없습니다.`).setColor('RED')] }).then(m => msgdelete(m, Number(process.env.MSGDELETE)));

    return message.reply('PONG!').then(m => msgdelete(m, 6000));
  },
};

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) { }
  }, t);
}