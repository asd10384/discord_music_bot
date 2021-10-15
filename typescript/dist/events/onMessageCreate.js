"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
async function onMessageCreate(message) {
    __1.msg.runCommand(message);
}
exports.default = onMessageCreate;
