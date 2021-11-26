import { Command } from "./Command";
import { Event } from "./Event";
import { IServerMusicQueue } from "./interfaces/Bot";
import { Collection, Client as DiscordClient, Intents, ColorResolvable } from "discord.js";
import { readdirSync, statSync } from "fs";
import { join } from "path";
import { color } from "../config";

export class Client extends DiscordClient {
  commands: Collection<string, Command>;
  slashCommands: Collection<string, Command>;
  prefixes: { [key: number]: string };
  musicQueue: Map<string, IServerMusicQueue>;
  declare token: string;
  testGuildId: string;
  color: ColorResolvable;

  /**
   * @param commandsPath the path from root to the commands directory
   * @param eventsPath the path from root to the events directory
   */
  public constructor(
    commandsPath: string,
    eventsPath: string,
    token?: string,
    testGuildId?: string
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
          if (command.data !== null) {
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
      const eventFileName = file.slice(0,-3);
      const eventName = eventFileName.toLowerCase();
      console.log(`${eventName} 이벤트 연결완료`);
      this.on(eventName, (...args: unknown[]) => event.run(args));
    }
  }
}
