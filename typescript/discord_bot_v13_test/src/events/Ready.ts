import { activitys } from "../config";
import { Event } from "../types/Event";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/rest/v9";
import { REFRESH_SLASH_COMMAND_ON_READY } from "../config";

export default class Ready extends Event {
  run = async (): Promise<void> => {
    try {
      const { slashCommands, token, testGuildId, user } = this.client;

      // Load up slash commands
      if (token) {
        const rest = new REST({ version: "9" }).setToken(token);
        const slashCommandsJSON = [];
        slashCommands.forEach((command) => slashCommandsJSON.push(command.data.toJSON()));

        // Load up commands of test server
        if (testGuildId) await this.loadTestServerCommands(slashCommandsJSON);

        // Load slash command routes for all servers (may take 1 hr to update)
        if (REFRESH_SLASH_COMMAND_ON_READY) {
          rest.put(Routes.applicationCommands(user.id), {
            body: slashCommandsJSON
          });
        }
      }
      await this.setActivity();
      console.log(`봇이 ${this.client.guilds.cache.size}개 서버에서 활성화 되었습니다.`);
      console.log(`${this.client.user.tag} is ready!`);
    } catch (err) {
      console.log(err);
    }
  };

  private async setActivity(): Promise<void> {
    if (activitys.length > 0) {
      this.client.user.setActivity(activitys[0].title);
      if (activitys.length > 1) {
        var number = 1;
        setInterval(() => {
          number += 1;
          if (number >= activitys.length) number = 0;
          this.client.user.setActivity(activitys[number].title);
        }, activitys[number].time);
      }
    }
  }

  /**
   * Load up the commands for the private test guild
   *
   * @param slashCommandsJSON a list of the JSON data for the slash commands
   */
  private async loadTestServerCommands(slashCommandsJSON: JSON[]): Promise<void> {
    const { user, testGuildId, token } = this.client;
    const rest = new REST({ version: "9" }).setToken(token);
    try {
      console.log("테스트 서버 (/) 커맨드 재설정중...");
      await rest.put(Routes.applicationGuildCommands(user.id, testGuildId), {
        body: slashCommandsJSON
      });
      console.log("테스트 서버 (/) 커맨드 재설정 성공");
    } catch (error) {
      console.log('테스트 서버 (/) 커맨드 에러:', error);
    }
  }
}
