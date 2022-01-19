
// 기본 모듈
require('dotenv').config();
const { readdirSync, existsSync, unlinkSync } = require('fs');
const { Client, Collection, Intents, Message, MessageEmbed } = require('discord.js');
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

// quick.db
const exists = existsSync(`json.sqlite`);
if (exists) unlinkSync(`json.sqlite`);
const db = require('quick.db');

// .env 가져오기
const { TOKEN, CLIENTID, GUILDID } = process.env;
const PREFIX = process.env.PREFIX || '/';
client.PREFIX = PREFIX;

// 명령어 불러오기
const commands = [];
client.commands = new Collection();
const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

// / 명령어 연결
const rest = new REST({ version: '9' }).setToken(TOKEN);
(async () => {
  await rest.put(
    Routes.applicationCommands(CLIENTID),
    { body: commands }
  ).then(() => {
    console.log(`/ 명령어 연결 완료`);
  }).catch((err) => console.error(err));
  // try {
  //   await rest.put(
  //     Routes.applicationGuildCommands(CLIENTID, GUILDID),
  //     { body: commands }
  //   );
  // } catch (err) {
  //   console.log(`${GUILDID}서버와 연결 실패`);
  // }
})();

// 기본 명령어 불러오기
const msgcommands = [];
client.msgcommands = new Collection();
const msgcommandFiles = readdirSync('./msgcommands').filter(file => file.endsWith('.js'));

for (const file of msgcommandFiles) {
  const command = require(`./msgcommands/${file}`);
  msgcommands.push(command);
  client.msgcommands.set(command.name, command);
}

// 이벤트 연결
const eventFiles = readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, event.execute);
  } else {
    client.on(event.name, event.execute);
  }
}

// / 명령어 클라이언트
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (command) {
    command.execute(interaction, client);
  }
});

// 기본 명령어 클라이언트
client.on('messageCreate', async (message) => {
  // 봇 메시지, dm 메세지 무시
  if (message.author.bot || message.channel.type === 'DM') return;

  if (message.content.startsWith(PREFIX)) {
    const content = message.content.slice(PREFIX.length).trim();

    const args = content.split(/ +/g);
    const commandName = args.shift().toLowerCase();

    const msgcommand = client.msgcommands.get(commandName) || client.msgcommands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
    try {
      await msgcommand.run(client, message, args, PREFIX, commands, msgcommands);
    } catch (err) {
      if (!commandName || commandName == '') return;
      // /* error check */ console.log(err);
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('DARK_RED')
            .setDescription(`\` ${commandName} \` 이라는 명령어를 찾을수 없습니다.`)
            .setFooter(` ${PREFIX}help 를 입력해 명령어를 확인해 주세요.`)
        ]
      }).then(m => msgdelete(m, 6000));
    } finally {
      return msgdelete(message, 120);
    }
  }
});

function msgdelete(m = new Message, t = Number) {
  setTimeout(() => {
    try {
      m.delete();
    } catch (err) {}
  }, t);
}

// login
client.login(TOKEN);
