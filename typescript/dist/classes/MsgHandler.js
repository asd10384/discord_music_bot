"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const fs_1 = require("fs");
const __1 = require("..");
const consts_1 = __importDefault(require("../consts"));
class MsgHandler {
    commands;
    constructor() {
        this.commands = new discord_js_1.Collection();
        const commandPath = consts_1.default.MSG_COMMANDS_PATH;
        const commandFiles = (0, fs_1.readdirSync)(commandPath);
        for (const commandFile of commandFiles) {
            const command = new (require(consts_1.default.MSG_COMMAND_PATH(commandFile)).default)();
            this.commands.set(command.metadata.name, command);
        }
    }
    runCommand(message) {
        if (message.author.bot || message.channel.type === 'DM')
            return;
        if (message.content.startsWith(__1.client.prefix)) {
            const content = message.content.slice(__1.client.prefix.length).trim();
            const args = content.split(/ +/g);
            const commandName = args.shift()?.toLowerCase();
            const command = this.commands.get(commandName) || this.commands.find((cmd) => cmd.metadata.aliases.includes(commandName));
            try {
                if (!command)
                    return err(message, commandName);
                command.run(message, args);
            }
            catch (error) {
                err(message, commandName);
            }
            finally {
                __1.client.msgdelete(message, 0);
            }
        }
        function err(message, commandName) {
            if (!commandName || commandName == '')
                return;
            let errembed = new discord_js_1.MessageEmbed()
                .setColor('DARK_RED')
                .setDescription(`\` ${commandName} \` 이라는 명령어를 찾을수 없습니다.`)
                .setFooter(` ${__1.client.prefix}help 를 입력해 명령어를 확인해주세요.`);
            return message.channel.send({
                embeds: [errembed]
            }).then(m => __1.client.msgdelete(m, 1));
        }
    }
}
exports.default = MsgHandler;
