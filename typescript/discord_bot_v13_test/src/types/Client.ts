import { Command } from "./Command";
import { Event } from "./Event";
import { IServerMusicQueue } from "./interfaces/Bot";
import { Collection, Client as DiscordClient, Intents, ColorResolvable, Message, MessageEmbed } from "discord.js";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { color, msgdeletetime, prefix } from "../config";

export class Client extends DiscordClient {
  commands: Collection<string, Command>;
  slashCommands: Collection<string, Command>;
  prefixes: { [key: number]: string };
  musicQueue: Map<string, IServerMusicQueue>;
  declare token: string;
  testGuildId: string;
  color: ColorResolvable;
  debug: boolean;

  /**
   * @param commandsPath the path from root to the commands directory
   * @param eventsPath the path from root to the events directory
   */
  public constructor(
    commandsPath: string,
    eventsPath: string,
    dev: boolean,
    token?: string,
    testGuildId?: string,
  ) {
    super({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      ]
    });
    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.prefixes = {};
    this.musicQueue = new Map();
    this.token = token;
    this.testGuildId = testGuildId;
    this.color = color;
    this.debug = dev;

    // Load all the commands
    readdirSync(commandsPath).forEach((dir) => {
      if (statSync(join(commandsPath, dir)).isDirectory()) {
        const commandFiles = readdirSync(`${commandsPath}/${dir}`).filter((f) => f.endsWith(".js") || f.endsWith(".ts"));

        for (const file of commandFiles) {
          const FoundCommand = require(`../commands/${dir}/${file}`).default;
          const command: Command = new FoundCommand(this);

          console.log(`${dir}/${file} 커맨드 연결완료`);
          this.commands.set(command.name, command);

          // Slash commands
          if (command.data) {
            this.slashCommands.set(command.name, command);
          }
        }
      }
    });

    // Load all the events
    const eventFiles = readdirSync(eventsPath).filter((f) => f.endsWith(".js") || f.endsWith(".ts"));
    
    for (const file of eventFiles) {
      const FoundEvent = require(join(`../events/${file}`)).default;
      const event: Event = new FoundEvent(this);
      const eventName = file.slice(0,-3);
      console.log(`${eventName} 이벤트 연결완료`);
      this.on(eventName, (...args: unknown[]) => event.run(args));
    }
  }

  /**
   * msgdelete
   * @param message Message
   * @param deletetime 기본시간(config참고)을 얼마나 사용할지설정 (사용예: 1.3)
   * @param customtime 기본시간(config참고)을 사용하지 않고 직접 설정
   */
  public msgdelete(message: Message, deletetime: number, customtime?: boolean) {
    var time = customtime ? deletetime : msgdeletetime * deletetime;
    if (time < 100) time = 100;
    setTimeout(() => {
      try {
        message.delete();
      } catch {}
    }, time);
  }

  /**
   * mkembed
   * @param options 임배드에 들어갈 옵션들
   * @returns message embed를 리턴
   */
  public mkembed(options?: {
    title?: string,
    description?: string,
    author?: { name: string, iconURL?: string, url?: string },
    url?: string,
    footer?: { text: string, iconURL?: string },
    image?: string,
    thumbnail?: string,
    color?: ColorResolvable,
    addField?: { name: string, value: string, inline?: boolean }
  }): MessageEmbed {
    const embed = new MessageEmbed().setColor(this.color);
    if (options?.title) embed.setTitle(options.title);
    if (options?.description) embed.setDescription(options.description);
    if (options?.author) embed.setAuthor(options.author.name, options.author.iconURL, options.author.url);
    if (options?.url) embed.setURL(options.url);
    if (options?.footer) embed.setFooter(options.footer.text, options.footer.iconURL);
    if (options?.image) embed.setImage(options.image);
    if (options?.thumbnail) embed.setThumbnail(options.thumbnail);
    if (options?.color) embed.setColor(options.color);
    if (options?.addField) embed.addField(options.addField.name, options.addField.value, options.addField.inline);
    return embed;
  }
}
