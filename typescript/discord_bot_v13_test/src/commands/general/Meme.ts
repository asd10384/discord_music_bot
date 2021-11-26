import { Command } from "../../types/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import axios from "axios";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";

export default class Meme extends Command {
  name = "meme"; // 이름
  visible = true; // 사용가능한가
  description = "Get a random meme"; // slash command 설명 (한글안됨)
  information = "랜덤 밈"; // command 설명
  aliases = [ "밈" ]; // 다른사용법
  cooldown = 1; // 쿨타임
  category = "기본"; // 카테고리
  guildOnly = true; // 서버에서만 사용가능 (false로 설정하면 DM(개인메세지에서 사용가능))
  data = new SlashCommandBuilder() // slash command 설정
    .setName(this.name) // slash command 이름
    .setDescription(this.description) // slash command 설명
  execute = async (message: Message): Promise<Message | void> => {
    const memeEmbed = await this.meme();
    return message.channel.send({ embeds: [ memeEmbed ] }).then(m => this.client.msgdelete(m, 3));
  };
  executeSlash = async (interaction: CommandInteraction): Promise<void> => {
    const memeEmbed = await this.meme();
    return interaction.reply({ embeds: [ memeEmbed ] });
  };

  /**
   * @returns an embed containing an image from r/dankmemes
   */
  private async meme(): Promise<MessageEmbed> {
    const response = await axios.get("https://www.reddit.com/r/dankmemes/random/.json");
    const [list] = response.data[0].data.children;
    const post = list.data;
    const memeUrl = `https://www.reddit.com${post.permalink}`;

    const date = new Date(post.created * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return this.client.mkembed({
      title: post.title,
      description: `**${post.author}**`,
      url: memeUrl,
      image: post.url,
      footer: { text: `⬆ ${post.ups} | 💬 ${post.num_comments} | 📅 ${day}/${month}/${year}` }
    });
  }
}
