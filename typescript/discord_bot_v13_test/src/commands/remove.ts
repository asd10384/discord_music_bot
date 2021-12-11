import { client } from "..";
import { check_permission as ckper, embed_permission as emper } from "../function/permission";
import { SlashCommand as Command } from "../interfaces/Command";
import { I, D } from "../aliases/discord.js.js";
import { MessageActionRow, MessageButton } from "discord.js";
import mkembed from "../function/mkembed";
import MDB from "../database/Mongodb";
import { nowplay } from "../database/obj/guild";
import setmsg from "../music/msg";

/**
 * DB
 * let guildDB = await MDB.get.guild(interaction);
 * 
 * check permission(role)
 * if (!(await ckper(interaction))) return await interaction.editReply({ embeds: [ emper ] });
 */

/** Remove 명령어 */
export default class RemoveCommand implements Command {
  /** 해당 명령어 설명 */
  metadata = <D>{
    name: 'remove',
    description: 'remove queue song',
    options: [{
      type: "INTEGER",
      name: "number",
      description: "삭제할 곡 번호 (참고: queue)",
      required: true
    }]
  };

  /** 실행되는 부분 */
  async run(interaction: I) {
    let number = interaction.options.getInteger('number', true);
    let musicDB = client.musicdb(interaction.guildId!);
    if (musicDB) {
      if (number > 0 && musicDB.queue.length >= number) {
        let list: nowplay[] = [];
        musicDB.queue.forEach((data, i) => {
          if (i !== number-1) list.push(data);
        });
        musicDB.queue = list;
        client.music.set(interaction.guildId!, musicDB);
        setmsg(interaction);
        await interaction.editReply({
          embeds: [
            mkembed({
              title: `${number}번 노래 제거 완료`,
              description: `/queue 로 번호를 확인해주세요.`,
              color: client.embedcolor
            })
          ]
        });
      } else {
        await interaction.editReply({
          embeds: [
            mkembed({
              title: `노래를 찾을수없음`,
              description: `/queue 로 번호를 확인해주세요.`,
              color: "DARK_RED"
            })
          ]
        });
      }
    }
  }
}