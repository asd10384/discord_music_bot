
require('dotenv').config();
const { MessageEmbed } = require('discord.js');

module.exports = {
  list: `__**대기열 목록:**__\n음성 채널에 참여한 후 노래제목 혹은 url로 노래를 대기열에 추가하세요.`,
  embed: new MessageEmbed()
    .setTitle(`**현재 노래가 재생되지 않았습니다.**`)
    .setImage(`https://cdn.hydra.bot/hydra_no_music.png`)
    .setFooter(`이 서버의 PREFIX : ${process.env.PREFIX}`)
}
