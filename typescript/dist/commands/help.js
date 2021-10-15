"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const discord_js_1 = require("discord.js");
class HelpCommand {
    metadata = {
        name: 'help',
        description: '명령어 확인',
        options: [{
                type: 'STRING',
                name: '명령어',
                description: '명령어 이름을 입력해 자세한 정보 확인',
                required: false
            }]
    };
    async run(interaction) {
        const commandName = interaction.options.getString('명령어');
        if (commandName) {
            const slashcommand = __1.slash.commands.get(commandName);
            const msgcommand = __1.msg.commands.get(commandName);
            let embed = new discord_js_1.MessageEmbed().setColor('ORANGE');
            if (slashcommand) {
                embed.setTitle(`\` /${commandName} \` 명령어`)
                    .setDescription(`이름: ${commandName}\n설명: ${slashcommand.metadata.description}`)
                    .setFooter(`도움말: /help`);
            }
            else if (msgcommand) {
                embed.setTitle(`\` ${__1.client.prefix}${commandName} \` 명령어`)
                    .setDescription(`이름: ${commandName}\nAND: ${(msgcommand.metadata.aliases) ? msgcommand.metadata.aliases : ''}\n설명: ${msgcommand.metadata.description}`)
                    .setFooter(`PREFIX: ${__1.client.prefix}`);
            }
            else {
                embed.setTitle(`\` ${commandName} \` 명령어`)
                    .setDescription(`명령어를 찾을수 없습니다.`)
                    .setFooter(`도움말: /help`)
                    .setColor('DARK_RED');
            }
            return await interaction.editReply({ embeds: [embed] });
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
        await interaction.editReply({ embeds: [slashcmdembed, msgcmdembed] });
    }
}
exports.default = HelpCommand;
