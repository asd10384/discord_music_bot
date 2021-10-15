"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)();
class Consts {
    static CLIENT_INTENTS = [
        'GUILDS',
        'GUILD_MESSAGES',
        'GUILD_MESSAGE_REACTIONS',
        'GUILD_VOICE_STATES'
    ];
    static SLASH_COMMANDS_PATH = (0, path_1.join)(__dirname, 'commands');
    static SLASH_COMMAND_PATH = (commandFile) => (0, path_1.join)(this.SLASH_COMMANDS_PATH, commandFile);
    static MSG_COMMANDS_PATH = (0, path_1.join)(__dirname, 'msgcommands');
    static MSG_COMMAND_PATH = (commandFile) => (0, path_1.join)(this.MSG_COMMANDS_PATH, commandFile);
}
exports.default = Consts;
