import { client } from "..";
import { MsgCommand as Command } from "../interfaces/Command";
import { I, D, M } from "../aliases/discord.js";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";

/** 핑 명령어 */
export default class PingCommand implements Command {
  /** 해당 명령어 설명 */
  metadata = {
    name: 'ping',
    description: 'Ping!',
    aliases: ['핑']
  };

  /** 실행되는 부분 */
  async run(message: M) {
    message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle(`Pong!`)
          .setDescription(`**${client.ws.ping}ms**`)
          .setFooter(`이 메세지는 곧 삭제됩니다.`)
          .setColor('ORANGE')
      ]
    }).then(m => client.msgdelete(m, 1.5));
  }
}