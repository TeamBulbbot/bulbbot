const Command = require("../../structures/Command")
const parse = require("parse-duration")
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Sets a slowmode to the selected channel",
            category: "Moderation",
            usage: "!slowmode [channel] <duration>",
            argList: ["duration:Duration"],
            minArgs: 1,
            maxArgs: 2,
            clearance: 50,
            userPerms: ["MANAGE_CHANNELS"],
            clientPerms: ["MANAGE_CHANNELS"],
        });
    }

    async run(message, args) {
        let duration;
        let targetChannel = args[0].replace(NonDigits, "");
        if (!args[1]) targetChannel = message.channel.id
        const channel = message.guild.channels.cache.get(targetChannel);

        if (!channel) return message.channel.send(this.client.bulbutils.translate("global_channel_not_found"))

        if (args.length === 1)
            duration = parse(args[0])
        else
            duration = parse(args[1])

        if (duration < parse("0s")) return message.channel.send(this.client.bulbutils.translate("slowmode_invalid_0s"))
        if (duration > parse("6h")) return message.channel.send(this.client.bulbutils.translate("slowmode_invalid_6h"))

        await channel.setRateLimitPerUser(duration / 1000)

        if (duration === parse("0s")) message.channel.send(this.client.bulbutils.translate("slowmode_success_remove", {channel}))
        else if (args.length === 1) message.channel.send(this.client.bulbutils.translate("slowmode_success", {channel, slowmode: args[0]}))
        else message.channel.send(this.client.bulbutils.translate("slowmode_success", {channel, slowmode: args[1]}))
    }
}