"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.msg = exports.slash = exports.client = void 0;
const BotClient_1 = __importDefault(require("./classes/BotClient"));
const SlashHandler_1 = __importDefault(require("./classes/SlashHandler"));
const MsgHandler_1 = __importDefault(require("./classes/MsgHandler"));
const onReady_1 = __importDefault(require("./events/onReady"));
const onInteractionCreate_1 = __importDefault(require("./events/onInteractionCreate"));
const onMessageCreate_1 = __importDefault(require("./events/onMessageCreate"));
exports.client = new BotClient_1.default();
exports.slash = new SlashHandler_1.default();
exports.msg = new MsgHandler_1.default();
exports.client.onEvent('ready', onReady_1.default);
exports.client.onEvent('interactionCreate', onInteractionCreate_1.default);
exports.client.onEvent('messageCreate', onMessageCreate_1.default);
