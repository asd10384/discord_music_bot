import { Command } from "../../types/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Collection, CommandInteraction, Message, MessageActionRow, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";

export default class Help extends Command {
  name = "help"; // 이름
  visible = true; // 사용가능한가
  description = "help command"; // slash command 설명 (한글안됨)
  information = "전체 명령어확인 또는 특정 명령어 상세정보 확인"; // command 설명
  aliases = [ "도움말" ]; // 다른사용법
  cooldown = 1; // 쿨타임
  category = "기본"; // 카테고리
  guildOnly = false; // 서버에서만 사용가능 (false로 설정하면 DM(개인메세지에서 사용가능))
  data = new SlashCommandBuilder() // slash command 설정
    .setName(this.name) // slash command 이름
    .setDescription(this.description) // slash command 설명
    // .addStringOption((option) => option // slash command option
    //   .setName("command") // slash command option name
    //   .setDescription("The command to get specific information on") // slash command option description
    // ); // slash command option end
  execute = async (message: Message, args: string[]): Promise<Message | void> => {
    if (args && args[0]) {
      return message.channel.send({ embeds: [ this.help(args, message.guildId) ] }).then(m => this.client.msgdelete(m, 5));
    } else {
      return message.channel.send({ embeds: [ this.help(undefined, message.guildId) ]}).then(m => this.client.msgdelete(m, 3));
    }
  };

  executeSlash = async (interaction: CommandInteraction | SelectMenuInteraction): Promise<any> => {
    if (interaction.isSelectMenu()) {
      return await interaction.editReply({
        embeds: [ this.help(interaction.values) ]
      });
    }
    if (interaction.isCommand()) {
      return await interaction.editReply({
        embeds: [ this.help() ],
        components: [ this.helprow() ]
      });
    }
  };

  /**
   * @param command the specific command to get help on
   * @returns help embed for general help ro specific help for a command based
   *          off arguments
   */
  private help(command?: string[], ismsg?: string): MessageEmbed {
    const commands = this.client.commands;
    const helpEmbed = this.client.mkembed();

    if (command) {
      this.specificInformation(helpEmbed, commands, command[0], ismsg);
    } else {
      this.generalInformation(helpEmbed, commands, ismsg);
    }
    return helpEmbed;
  }

  /**
   * @returns return help action row
   */
  private helprow(): MessageActionRow {
    const cmdlist: { label: string, description: string, value: string }[] = [];
    const commands = this.client.commands;
    commands.map((command) => {
      if (command.visible) {
        cmdlist.push({
          label: command.name,
          description: command.information ? command.information : command.description,
          value: command.name
        });
      }
    });
    return new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('help')
          .setPlaceholder('명령어를 선택해주세요.')
          .addOptions(cmdlist)
      );
  }

  /**
   * Add general information to an embed and send it
   *
   * @param helpEmbed the MessageEmbed to add details to
   * @param commands a collection of the bot's command
   */
  private generalInformation(helpEmbed: MessageEmbed, commands: Collection<string, Command>, ismsg?: string): void {
    // Add all the details of the commands
    helpEmbed.setTitle("**사용가능한 명령어**");

    this.addCategory("기본", helpEmbed, commands);
    this.addCategory("음악", helpEmbed, commands);
    helpEmbed.setFooter(
      ismsg ? `${this.client.prefixes[ismsg]}help [command name] 으로 명령어 상세내용을 확인할수 있습니다.`
      : `아래 선택메뉴로 명령어 상세내용을 확인할수 있습니다.`
    );
  }

  /**
   * Adds general information on commands of the specified category
   *
   * @param category the name of the category
   * @param helpEmbed the MessageEmbed to add details to
   * @param commands a collection of the bot's commands
   */
  private addCategory(category: string, helpEmbed: MessageEmbed, commands: Collection<string, Command>): void {
    // Format the relevant data, not sure how to use filter function
    const data = [];
    const dataCommands = commands;
    data.push(dataCommands.map((command) => {
      if (command.category === category && command.visible) {
        return `**${command.name}**: ${command.information ? command.information : command.description}\n`;
      } else {
        return "";
      }
    }).join(""));

    // Add it to the embed
    helpEmbed.addField(`**${category} 명령어**`, `${data.join("\n")}\n`, false);
  }

  /**
   * Adds specific information about a command
   *
   * @param name the arguments given by the user
   * @param helpEmbed the MessageEmbed to add details to
   * @param commands a collection of the bot's commands
   */
  private specificInformation(helpEmbed: MessageEmbed, commands: Collection<string, Command>, name: string, ismsg?: string): void {
    // Check if the command exists
    name = name.toLowerCase();
    const command = commands.get(name) || commands.find((c) => c.aliases && c.aliases.includes(name));
    if (!command) {
      helpEmbed.setTitle(`\` help \` 명령어 오류`)
        .setDescription(`\` ${name} \` **명령어를 찾을수 없습니다.**`)
        .setColor("DARK_RED");
      return;
    }

    // Else find information on the command
    helpEmbed.setTitle(`\` ${command.name} \` 명령어`);
    const data = [];
    if (command.aliases.length > 0) {
      data.push(`**다른사용법:** ${command.aliases.join(", ")}`);
    }
    if (command.information) {
      data.push(`**설명:** ${command.information}`);
    } else if (command.description) {
      data.push(`**설명:** ${command.description}`);
    }
    if (command.cooldown) {
      data.push(`**쿨타임:** ${command.cooldown} 초`);
    }
    helpEmbed.setDescription(data.join("\n"));
  }
}
