"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const discord_js_1 = require("discord.js");
class HelpCommand {
    metadata = {
        name: 'help',
        description: '명령어 확인',
        aliases: ['도움말', '명령어']
    };
    async run(message, args) {
        if (args[0]) {
            const slashcommand = __1.slash.commands.get(args[0]);
            const msgcommand = __1.msg.commands.get(args[0]) || __1.msg.commands.find((cmd) => cmd.metadata.aliases && cmd.metadata.aliases.includes(args[0]));
            let embed = new discord_js_1.MessageEmbed().setColor('ORANGE');
            if (slashcommand) {
                embed.setTitle(`\` /${args[0]} \` 명령어`)
                    .setDescription(`이름: ${args[0]}\n설명: ${slashcommand.metadata.description}\n옵션: ${slashcommand.metadata.options}`)
                    .setFooter(`도움말: /help`);
            }
            else if (msgcommand) {
                embed.setTitle(`\` ${__1.client.prefix}${args[0]} \` 명령어`)
                    .setDescription(`이름: ${args[0]}\nAND: ${(msgcommand.metadata.aliases) ? msgcommand.metadata.aliases : ''}\n설명: ${msgcommand.metadata.description}`)
                    .setFooter(`PREFIX: ${__1.client.prefix}`);
            }
            else {
                embed.setTitle(`\` ${args[0]} \` 명령어`)
                    .setDescription(`명령어를 찾을수 없습니다.`)
                    .setFooter(`도움말: /help`)
                    .setColor('DARK_RED');
            }
            return message.channel.send({ embeds: [embed] }).then(m => __1.client.msgdelete(m, 2.5));
        }
        let slashcmdembed = new discord_js_1.MessageEmbed()
            .setTitle(`\` slash (/) \` 명령어`)
            .setDescription(`명령어\n명령어 설명`)
            .setColor('ORANGE');
        let msgcmdembed = new discord_js_1.MessageEmbed()
            .setTitle(`\` 기본 (${__1.client.prefix}) \` 명령어`)
            .setDescription(`명령어\n명령어 설명`)
            .setFooter(`PREFIX: ${__1.client.prefix}`)
            .setColor('ORANGE');
        __1.slash.commands.forEach((cmd) => {
            slashcmdembed.addField(`**/${cmd.metadata.name}**`, `${cmd.metadata.description}`, true);
        });
        __1.msg.commands.forEach((cmd) => {
            msgcmdembed.addField(`**${__1.client.prefix}${cmd.metadata.name} [${(cmd.metadata.aliases) ? cmd.metadata.aliases : ''}]**`, `${cmd.metadata.description}`, true);
        });
        return message.channel.send({ embeds: [slashcmdembed, msgcmdembed] }).then(m => __1.client.msgdelete(m, 3));
    }
}
exports.default = HelpCommand;
