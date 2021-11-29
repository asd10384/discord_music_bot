import { Command } from "../../types/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, Message, VoiceChannel } from "discord.js";

export default class Repeat extends Command {
  name = "repeat";
  visible = true;
  description = "Repeat the queue";
  information = "노래 반복재생";
  aliases = [ "반복" ];
  cooldown = 1;
  category = "음악";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  execute = (message: Message): Promise<Message> => {
    return message.channel.send({ embeds: [
      this.repeat(message.member.voice.channel as VoiceChannel, message.guild.id)
    ] });
  };
  executeSlash = async (interaction: CommandInteraction): Promise<any> => {
    interaction.member = interaction.member as GuildMember;
    return await interaction.editReply({ embeds: [
      this.repeat(interaction.member.voice.channel as VoiceChannel, interaction.guild.id)
    ] });
  };

  /**
   * Attempts to toggle the repeat option of the server's music queue.
   *
   * @param voiceChannel the voice channel the user is in
   * @param guildId the id of the server this command is used in
   * @returns a message embed with the status of the repeat option
   */
  private repeat(voiceChannel: VoiceChannel, guildId: string) {
    const musicQueue = this.client.musicQueue;
    const serverQueue = musicQueue.get(guildId);

    if (!serverQueue) return this.client.mkembed({
      description: "There is no active music queue in the server!"
    });

    if (serverQueue.voiceChannel !== voiceChannel) return this.client.mkembed({ description: "You are not in the right voice channel" });

    serverQueue.isRepeating = !serverQueue.isRepeating;
    return this.client.mkembed({
      description: `Queue is now **${serverQueue.isRepeating ? "repeating" : "not repeating"}**`
    });
  }
}
