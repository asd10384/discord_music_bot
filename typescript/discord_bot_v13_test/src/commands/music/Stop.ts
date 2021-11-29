import { Command } from "../../types/Command";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getVoiceConnection } from "@discordjs/voice";
import { CommandInteraction, GuildMember, Message, VoiceChannel } from "discord.js";

export default class Stop extends Command {
  name = "stop";
  visible = true;
  description = "Remove all songs from the current queue";
  information = "음악 중지";
  aliases = [];
  cooldown = 1;
  category = "음악";
  guildOnly = true;
  data = new SlashCommandBuilder()
    .setName(this.name)
    .setDescription(this.description);
  execute = (message: Message): Promise<Message> => {
    return message.channel.send({ embeds: [
      this.stop(message.member.voice.channel as VoiceChannel, message.guild.id)
    ] });
  };
  executeSlash = async (interaction: CommandInteraction): Promise<any> => {
    interaction.member = interaction.member as GuildMember;
    return await interaction.editReply({ embeds: [
      this.stop(interaction.member.voice.channel as VoiceChannel, interaction.guild.id)
    ] });
  };

  /**
   * Attempts to stop the current queue
   *
   * @param voiceChannel the voice channel the user is in
   * @param guildId the id of the server this command is used in
   * @returns a message embed with the status of stopping the queue
   */
  private stop(voiceChannel: VoiceChannel, guildId: string) {
    const musicQueue = this.client.musicQueue;
    const serverQueue = musicQueue.get(guildId);

    if (!serverQueue) {
      return this.client.mkembed({
        description: "There is no active music queue in the server!"
      });
    }

    if (serverQueue.voiceChannel !== voiceChannel) {
      return this.client.mkembed({
        description: "You are not in the right voice channel"
      });
    }

    serverQueue.songs = [];
    const connection = getVoiceConnection(guildId);
    connection.destroy();
    return this.client.mkembed({ description: "Removed all songs from the queue" });
  }
}
