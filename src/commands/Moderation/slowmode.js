const Command = require("../../structures/Command")
const parse = require("parse-duration")
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Sets a slowmode to the selected channel",
            category: "Moderation",
            usage: "!slowmode <duration> [channel]",
            argList: ["duration:Duration", "channel:Channel"],
            minArgs: 1,
            maxArgs: 2,
            clearance: 50,
            userPerms: ["MANAGE_CHANNELS"],
            clientPerms: ["MANAGE_CHANNELS"],
        });
    }

    async run(message, args) {
        const duration = parse(args[0])
        const channel = message.guild.channel(args[1].replace(NonDigits, ""))

        if (duration < parse("0s")) return message.channel.send(this.client.bulbutils.translate("slowmode_invalid_0s"))
        if (duration > parse("6h")) return message.channel.send(this.client.bulbutils.translate("slowmode_invalid_6h"))
    }
}