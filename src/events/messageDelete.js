const Event = require("../structures/Event");
const {SendEventLog} = require("../utils/moderation/log");

module.exports = class extends (
    Event
) {
    constructor(...args) {
        super(...args, {});
    }

    run(message) {
        if (message.author.id === this.client.user.id) return;

        let msg = "";

        if (message.attachments.first()) msg += `**Attachment deleted:** ${message.attachments.first().proxyURL}\n`;
        if (message.content) msg += `**Message deleted:** ${message.content}`;

        SendEventLog(this.client, message.guild, "message", msg);
    }
};
