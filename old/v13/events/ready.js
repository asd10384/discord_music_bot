
require('dotenv').config();
const db = require('quick.db');
const { Client } = require('discord.js');
const ACTIVITY = require('../activity');

module.exports = {
  name: 'ready',
  once: true,
  execute(client = new Client) {
    var db_text = '';
    try {
      var w = db.fetch(`db`);
      for (let i in w) {
        db_text += `\n${i}: {\n`;
        for (let j in w[i]) {
          if (String(w[i][j]) === '[object Object]') {
            db_text += `    ${j}: {\n`;
          } else {
            db_text += `    ${j}: ${w[i][j]}\n`;
          }
          for (let k in w[i][j]) {
            db_text += `        ${k}: ${w[i][j][k]}\n`;
          }
          if (String(w[i][j]) === '[object Object]') db_text += `    }\n`;
        }
        db_text += `}\n`;
      }
    } catch (err) {
      db_text = '\n없음\n';
    }
    console.log(`===============================\n 이름 : ${client.user.username}\n\n 태그 : ${client.user.tag}\n===============================\n`);
    console.log(`===============================\n${(db_text === '') ? '\n없음\n' : db_text}\n===============================`);

    client.user.setPresence({
      activities: [{
        name: ACTIVITY[0].name,
        type: ACTIVITY[0].type
      }],
      status: ACTIVITY[0].status
    });
    setactivity(client);
  }
};

function setactivity(client = new Client) {
  var i = ACTIVITY.length-1;
  setInterval(function () {
    client.user.setPresence({
      activities: [{
        name: ACTIVITY[i].name,
        type: ACTIVITY[i].type
      }],
      status: ACTIVITY[i].status
    });
    i++;
    if (i >= ACTIVITY.length) i = 0;
  }, ACTIVITY[i].time * 1000);
}
