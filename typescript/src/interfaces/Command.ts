import { ApplicationCommandData, CommandInteraction, Message } from "discord.js";

export interface SlashCommand {
  run: (args: CommandInteraction) => any;
  metadata: ApplicationCommandData;
}

export interface MsgCommand {
  run: (message: Message, args: string[]) => any;
  metadata: {
    name: string,
    description: string,
    aliases: string[]
  };
}