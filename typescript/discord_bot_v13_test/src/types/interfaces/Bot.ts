import { AudioPlayer } from "@discordjs/voice";
import { Collection, GuildMember, Message, StageChannel, TextChannel, VoiceChannel } from "discord.js";
import * as ytdl from "ytdl-core";

/**
 * Contains all the data for each song in the play song command
 */
export interface ISong {
  info: ytdl.videoInfo;
  title: string;
  url: string;
  duration: number;
  formattedDuration: string;
  member: GuildMember;
}

/**
 * Contains data for the music queue of a server
 */
export interface IServerMusicQueue {
  voiceChannel: VoiceChannel | StageChannel;
  textChannel: TextChannel;
  songs: ISong[];
  audioPlayer: AudioPlayer;
  playingMessage: Message;
  isPlaying: boolean;
  isRepeating: boolean;
}

/**
 * Contains data for the player profile in profile command
 */
export interface IPlayerData {
  name: string;
  accountId: number;
  mmrEstimate: number;
  country: string;
  avatar: string;
  win: number;
  lose: number;
  winRate: number;
  rankTier: number;
  leaderboardRank: number;
}

export type Cooldown = Collection<string, number>;
