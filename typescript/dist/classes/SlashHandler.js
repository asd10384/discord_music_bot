"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const consts_1 = __importDefault(require("../consts"));
class SlashHandler {
    commands;
    constructor() {
        this.commands = new Map();
        const commandPath = consts_1.default.SLASH_COMMANDS_PATH;
        const commandFiles = (0, fs_1.readdirSync)(commandPath);
        for (const commandFile of commandFiles) {
            const command = new (require(consts_1.default.SLASH_COMMAND_PATH(commandFile)).default)();
            this.commands.set(command.metadata.name, command);
        }
    }
    runCommand(interaction) {
        const commandName = interaction.commandName;
        const command = this.commands.get(commandName);
        if (!command)
            return;
        command.run(interaction);
    }
    async registCachedCommands(client) {
        if (!client.application)
            return console.warn('WARNING: registCachedCommands() called before application is ready.');
        const metadatas = [];
        for (const command of this.commands.values()) {
            if (!command.metadata)
                continue;
            metadatas.push(command.metadata);
        }
        if (process.env.ENVIROMENT?.toUpperCase() === 'DEV') {
            await client.application.commands.set([], process.env.ENVIROMENT_DEV_GUILD);
            await client.application.commands.set(metadatas, process.env.ENVIROMENT_DEV_GUILD);
            console.log('Registered commands for guild:', process.env.ENVIROMENT_DEV_GUILD);
            return;
        }
        await client.application.commands.set([]);
        await client.application.commands.set(metadatas);
        console.log('Registered commands.');
    }
}
exports.default = SlashHandler;
