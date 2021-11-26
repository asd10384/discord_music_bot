import { ColorResolvable } from "discord.js";


// 이 값이 true라면 봇이 켜질때 마다 명령어를 새로 등록합니다. (프로덕션일 경우 true로 한번 돌린 후 바로 false로 바꿔주세요)
export const REFRESH_SLASH_COMMAND_ON_READY: boolean = false;

// prefix
export const prefix: string = "m;";

// mongoose 관련 설정
export const botnumber: string = "_test";

// 기본 embed 색 지정
export const color: ColorResolvable = "ORANGE";

// 
export const vcStandbyDuration: number = 1000 * 600;

// 메세지 자동삭제 시간 조정
export const msgdeletetime: number = 6000;

// 봇 activitys
export const activitys: { title: string, time: number }[] = [
  {
    title: "/help",
    time: 10
  },
  {
    title: prefix + "help",
    time: 10
  }
];