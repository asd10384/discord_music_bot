import { Command } from "../../types/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";

export default class Ping extends Command {
  name = "ping"; // 이름
  visible = true; // 사용가능한가
  description = "check ping"; // slash command 설명 (한글안됨)
  information = "봇 지연시간 확인"; // command 설명
  aliases = [ "핑" ]; // 다른사용법
  cooldown = 1; // 쿨타임
  category = "기본"; // 카테고리
  guildOnly = false; // 서버에서만 사용가능 (false로 설정하면 DM(개인메세지에서 사용가능))
  data = new SlashCommandBuilder() // slash command 설정
    .setName(this.name) // slash command 이름
    .setDescription(this.description) // slash command 설명
  execute = (message: Message): Promise<Message | void> => {
    return message.channel.send({ embeds: [ this.ping(message.createdTimestamp) ] }).then(m => this.client.msgdelete(m, 1.5));
  };
  executeSlash = async (interaction: CommandInteraction): Promise<any> => {
    return await interaction.editReply({ embeds: [ this.ping(interaction.createdTimestamp) ] });
  };

  private ping(startTime: number): MessageEmbed {
    const ping = Date.now() - startTime;
    return this.client.mkembed({ title: `Pong! **\` ${ping}ms \`**` });
  }
}
