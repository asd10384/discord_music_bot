
require('dotenv').config();
const { Client, User, ReactionCollector, MessageEmbed, Message } = require('discord.js');
const db = require('quick.db');

module.exports = reac = async function (client = new Client, reaction = new ReactionCollector, user = new User) {
  if (user.bot) return;
  if (!reaction.message.guild) return;
  return await go(client, reaction, user);
}

async function go(client = new Client, reaction = new ReactionCollector, user = new User) {
  if (reaction.message.partial) await reaction.message.fetch();
  if (reaction.partial) await reaction.fetch();
  const name = reaction.emoji.name;
  const message = reaction.message;
  const member = message.guild.members.cache.get(user.id);
  const memebername = (member && member.nickname) ? member.nickname : member.user.username;

  // 채팅채널 연결
  let channelid = await db.get(`${message.guildId}.channlid`) || null;
  if (!channelid) return;

  // 음성채널
  let voicechannel = member.voice.channel || null;

  if (message.channel.id === channelid) {
    if (name === '⏭️') {
      reaction.users.remove(user).catch((err) => { return; });
      if (!voicechannel.id) return errmsg(message, memebername, `스킵`);
      return skip();
    }
  }
}

async function errmsg(message = new Message, memebername = new String, why = new String) {
  const em = new MessageEmbed()
    .setTitle(`**${why} 오류**`)
    .setDescription(`**${memebername}님\n같은 음성채널에서**\n**사용해주세요.**`)
    .setColor('RED');
  return message.channel.send(em).then(m => msgdelete(m, Number(process.env.MSGDELETE)));
}

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) { }
  }, t);
}
