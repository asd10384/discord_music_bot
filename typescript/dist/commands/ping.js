"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const discord_js_1 = require("discord.js");
class PingCommand {
    metadata = {
        name: 'ping',
        description: 'Ping!'
    };
    async run(interaction) {
        const id = Math.random().toString(36).substr(2, 5);
        const retryBtn = new discord_js_1.MessageButton({ customId: id, label: '다시 측정', style: 'SUCCESS' });
        const actionRow = new discord_js_1.MessageActionRow({ components: [retryBtn] });
        await interaction.editReply({
            embeds: [
                new discord_js_1.MessageEmbed()
                    .setTitle(`Pong!`)
                    .setDescription(`**${__1.client.ws.ping}ms**`)
                    .setColor('ORANGE')
            ], components: [actionRow]
        });
        const i = await interaction.channel?.awaitMessageComponent({
            filter: (i) => i.customId === id && i.user.id === interaction.user.id,
            componentType: 'BUTTON'
        });
        if (!i)
            return;
        await i.deferReply();
        this.run(i);
    }
}
exports.default = PingCommand;
