"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
async function onInteractionCreate(interaction) {
    if (!interaction.isCommand())
        return;
    await interaction.deferReply({ ephemeral: true }).catch(() => { });
    __1.slash.runCommand(interaction);
}
exports.default = onInteractionCreate;
