
require('dotenv').config();
const PREFIX = process.env.PREFIX;

/**
 * type: WATCHING PLAYING LISTENING STREAMING COMPETING
 * status: online idle dnd invisible
 * 앞에서부터: 온라인 자리비움 방해금지 오프라인
 * time: 시간단위
 */

module.exports = [
  {
    name: `${PREFIX}help`,
    type: 'WATCHING',
    status: 'online',
    time: 20
  },
  {
    name: `${PREFIX}도움말`,
    type: 'WATCHING',
    status: 'online',
    time: 20
  }
];