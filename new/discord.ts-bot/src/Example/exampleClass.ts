import { Guild } from "discord.js";

export class EXA {
  guild: Guild;

  constructor(guild: Guild) {
    this.guild = guild;
  }
}