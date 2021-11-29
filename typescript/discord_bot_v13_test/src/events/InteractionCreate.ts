import { Event } from "../types/Event";
import { CommandInteraction, Interaction, SelectMenuInteraction } from "discord.js";
import { Command } from "../types/Command";

export default class InteractionCreate extends Event {
  run = async (args: Interaction[]): Promise<void> => {
    const [interaction] = args;
    var commandInteraction: CommandInteraction | SelectMenuInteraction;
    var commandName = '';
    var command: Command;
    if (interaction.isSelectMenu()) {
      commandInteraction = interaction as SelectMenuInteraction;
      commandName = interaction.customId;
      command = this.client.commands.get(commandName);
    }
    if (interaction.isCommand()) {
      commandInteraction = interaction as CommandInteraction;
      commandName = commandInteraction.commandName;
      command = this.client.commands.get(commandName);
    }
    try {
      await (interaction as CommandInteraction).deferReply({ ephemeral: true }).catch((err) => { if (this.client.debug) console.log(err); });
      command.executeSlash(commandInteraction);
    } catch (error) {
      if (this.client.debug) {
        console.log('interaction 에러:', error);
        (interaction as CommandInteraction).editReply(`interaction 에러: ${error}`);
      }
    }
  };
}
