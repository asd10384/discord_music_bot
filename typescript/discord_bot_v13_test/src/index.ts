import { GuildModel } from "./database/Guild";
import { Client } from "./types/Client";
import { connect as mongooseConnect } from "mongoose";

// dotenv
import { config } from "dotenv";
config();

// 봇 설정
//------------------------------------------------------------------------------
console.log(process.argv[0].includes("ts-node"));
if (false) {
  const dev: boolean = process.argv[0].endsWith("ts-node");
  const commandPaths: string = dev ? "src/commands" : "dist/src/commands";
  const eventsPath: string = dev ? "src/events" : "dist/src/events";
  
  const client = new Client(
    commandPaths,
    eventsPath,
    dev,
    process.env.BOT_TOKEN,
    process.env.TEST_SERVER_ID
  );
  
  
  // mongoose 데이터베이스 연결
  //------------------------------------------------------------------------------
  mongooseConnect(process.env.MONGOOSE_URL).then(() => {
    console.log("MongoDB: 연결완료");
    GuildModel.find().then((guilds) => {
      guilds.forEach((guild) => {
        client.prefixes[guild.guildId] = guild.prefix;
      });
    }).catch((err) => {
      console.log("MongoDB: server ids가 없음, 에러코드:", err);
    });
  }).catch((err) => {
    console.log("MongoDB: MongoDB에 연결하지 못함, 에러코드:", err);
  });
  
  // 로그인
  //------------------------------------------------------------------------------
  try {
    client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.log(`봇로그인: 오류발생: ${error}`);
  }
  
}