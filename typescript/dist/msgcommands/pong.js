"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const discord_js_1 = require("discord.js");
class PongCommand {
    metadata = {
        name: 'pong',
        description: 'Pong!',
        aliases: ['퐁']
    };
    async run(message, args) {
        message.channel.send({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle(`Ping!`)
                    .setDescription(`**${__1.client.ws.ping}ms**`)
                    .setFooter(`이 메세지는 곧 삭제됩니다.`)
                    .setColor('ORANGE')
            ]
        }).then(m => __1.client.msgdelete(m, 1.5));
    }
}
exports.default = PongCommand;
