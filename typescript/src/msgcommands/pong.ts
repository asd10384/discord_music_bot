import { client } from "..";
import { MsgCommand as Command } from "../interfaces/Command";
import { I, D, M } from "../aliases/discord.js.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

/** 퐁 명령어 */
export default class PongCommand implements Command {
  /** 해당 명령어 설명 */
  metadata = {
    name: 'pong',
    description: 'Pong!',
    aliases: ['퐁']
  };

  /** 실행되는 부분 */
  async run(message: M, args: string[]) {
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Ping!`)
          .setDescription(`**${client.ws.ping}ms**`)
          .setFooter(`이 메세지는 곧 삭제됩니다.`)
          .setColor('ORANGE')
      ]
    }).then(m => client.msgdelete(m, 1.5));
  }
}