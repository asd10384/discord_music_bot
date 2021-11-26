import * as config from "../config";
import { Client } from "../types/Client";
import { Event } from "../types/Event";
import { Cooldown } from "../types/interfaces/Bot";
import { Collection, Guild, Message as DiscordMessage } from "discord.js";

export default class MessageCreate extends Event {
  cooldowns: Collection<string, Cooldown>;

  constructor(client: Client) {
    super(client);
    this.cooldowns = new Collection();
  }

  run = async (args: DiscordMessage[]): Promise<DiscordMessage | void> => {
    const [message] = args;

    // 봇 입력 제거
    if (message.author.bot) return;

    // prefix 확인 (없으면 기본값 [config참고])
    const prefix = this.findPrefix(message.guild);

    if (message.content.startsWith(prefix)) {
      // prefix 제거하고 args 재생성
      const messageArgs = message.content.slice(prefix.length).split(/ +/);
      // 첫 args 를 소문자로 변환후 commandName 으로 등록
      const commandName = messageArgs.shift().toLowerCase();

      // command 확인
      const command = this.client.commands.get(commandName) || this.client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));
      if (!command) return;

      // 커맨드 오류처리
      //----------------------------------------------------------------------------
      
      // DMs
      if (command.guildOnly && message.channel.type === "DM") {
        return message.channel.send({ content: `\` ${commandName} \` 명령어는 **개인 메세지**에서 사용할수 없습니다.` }).then(m => this.client.msgdelete(m, 1));
      }

      // 쿨타임
      if (!this.cooldowns.has(command.name)) this.cooldowns.set(command.name, new Collection());
      const now = Date.now();
      const timestamps = this.cooldowns.get(command.name);
      const cooldownAmount = command.cooldown * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.channel.send({ embeds: [
            this.client.mkembed({
              author: { name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) },
              title: `\` ${message.member.nickname ? message.member.nickname : message.author.username} \` \` ${commandName} \` 쿨타임`,
              description: `**${timeLeft.toFixed(2)}**초후 사용해주세요.`,
              color: "DARK_RED"
            })
          ] }).then(m => this.client.msgdelete(m, 1));
        }
      }
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

      // Else executes the command
      //----------------------------------------------------------------------------
      try {
        command.execute(message, messageArgs);
      } catch (error) {
        message.reply(`There was an error ${error}`);
        if (this.client.debug) console.log(error);
      }
    }
  };

  /**
   * Find the prefix for the corresponding server and return it
   *
   * @param guild the server
   * @returns the prefix of the server
   */
  private findPrefix(guild: Guild): string {
    if (this.client.prefixes.hasOwnProperty(guild.id)) {
      return this.client.prefixes[guild.id];
    }
    return config.prefix;
  }
}
