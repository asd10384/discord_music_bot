
require('dotenv').config();
const { Client, Intents, Collection, MessageEmbed, Message } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
// const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
const { existsSync, unlinkSync, readdirSync } = require('fs');
const { join } = require('path');
var checkyturl = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/g;

// env
const PREFIX = process.env.PREFIX;
const MSGDELETE = Number(process.env.MSGDELETE) || 6000;

// quick.db
const exists = existsSync(`json.sqlite`);
if (exists) unlinkSync(`json.sqlite`);
const db = require('quick.db');

// commands get
client.commands = new Collection();
const commandFiles = readdirSync(join(__dirname, 'cmd')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(join(__dirname, 'cmd', `${file}`));
  client.commands.set(command.name, command);
}

// client errorcheck
client.on('error', (err) => console.log(err));

// client on
require('./client/ready')(client);

// client login
client.login(process.env.TOKEN);

client.on('message', async (message = new Message) => {
  // 봇 메시지 무시
  if (message.author.bot) return;
  // dm 메세지 확인
  if (message.channel.type === 'dm') {
    if (message.content.startsWith(PREFIX) && ['help'].concat(client.commands.get('help').aliases).indexOf(message.content.slice(PREFIX.length).trim().split(/ +/g).shift().toLowerCase() > -1)) {
      return client.commands.get('help').dmrun(client, message, message.content.slice(PREFIX.length).trim().split(/ +/g).slice(1), PREFIX);
    }
  }

  // 채팅 채널 연결
  let channelid = await db.get(`${message.guildId}.channelid`) || 0;
  
  // PREFIX 입력시
  if (message.content.startsWith(PREFIX)) {
    const content = message.content.slice(PREFIX.length).trim();

    const args = content.split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

    try {
      // 명령어 실행
      await command.run(client, message, args, PREFIX, message.member.user);
      return msgdelete(message, 110);
    } catch (error) {
      if (!commandName || commandName == '') return;
      // 오류 확인
      // console.log(error);
      let embed = new MessageEmbed()
        .setColor('DARK_RED')
        .setDescription(`\` ${commandName} \` 이라는 명령어를 찾을수 없습니다.`)
        .setFooter(` ${PREFIX}help 를 입력해 명령어를 확인해 주세요.`);
      message.channel.send(embed).then(m => msgdelete(m, MSGDELETE));
      return msgdelete(message, 110);
    }
  } else {
    const args = message.content.trim().split(/ +/g);
    let command;
    if (channelid == message.channel.id) {
      command = client.commands.get('play');
    }
    if (command) return command.run(client, message, args, PREFIX, message.member.user, true);
  }
});

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) {}
  }, t);
}

const reac = require('./client/reaction');
client.on('messageReactionAdd', async (reaction, user) => {
  await reac(client, reaction, user);
});

// const { MessageComponent } = require('discord-buttons');
// const clickbutton = require('./client/clickbutton');
// client.on('clickButton', async (button = new MessageComponent) => {
//   return clickbutton(client, button);
// });
