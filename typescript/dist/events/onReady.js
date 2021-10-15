"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
function onReady() {
    if (!__1.client.user)
        return;
    console.log('Ready!', __1.client.user.username);
    __1.client.user.setActivity('/ping');
    if (process.env.REFRESH_SLASH_COMMAND_ON_READY === 'true') {
        __1.slash.registCachedCommands(__1.client);
    }
}
exports.default = onReady;
