"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const consts_1 = __importDefault(require("../consts"));
(0, dotenv_1.config)();
class BotClient extends discord_js_1.Client {
    prefix;
    msgdelete;
    deletetime;
    constructor() {
        super({ intents: consts_1.default.CLIENT_INTENTS });
        if (!process.env.DISCORD_TOKEN) {
            throw new Error('.env 파일에 DISOCRD_TOKEN이 없음.');
        }
        this.token = process.env.DISCORD_TOKEN;
        this.prefix = process.env.PREFIX || 'm;';
        this.login();
        this.deletetime = 6000;
        this.msgdelete = (message, time) => {
            let dtime = this.deletetime * time;
            if (dtime < 100)
                dtime = 100;
            setTimeout(() => { try {
                message.delete();
            }
            catch (err) { } }, dtime);
        };
    }
    onEvent = (event, func, ...extra) => this.on(event, (...args) => func(...args, ...extra));
    totalUserCount = () => this.totalCounter('users');
    totalGuildCount = () => this.totalCounter('guilds');
    totalChannelCount = () => this.totalCounter('channels');
    async totalCounter(key) {
        if (!this.shard)
            return this[key].cache.size;
        const shardData = await this.shard.fetchClientValues(`${key}.cache.size`);
        return shardData.reduce((prev, curr) => prev + curr, 0);
    }
}
exports.default = BotClient;
