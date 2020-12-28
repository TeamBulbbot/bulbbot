const Command = require("../../structures/Command")
const {NonDigits} = require("../../utils/Regex");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Locks/unlocks a selected channel",
            category: "Moderation",
            usage: "!lockdown <channel> <lock>",
            argList: ["channel:Channel", "lock:boolean"],
            minArgs: 2,
            maxArgs: 2,
            clearance: 50,
            userPerms: ["MANAGE_CHANNELS"],
            clientPerms: ["MANAGE_CHANNELS"],
        });
    }

    async run(message, args) {
        const channel = message.guild.channels.cache.get(args[0].replace(NonDigits, ""))
        if (!channel) return message.channel.send(this.client.bulbutils.translate("global_channel_not_found"))

        if (args[1] !== "true" && args[1] !== "false") return message.channel.send(this.client.bulbutils.translate("lockdown_not_boolean"))

        if (args[1] === "true") {
            await channel.overwritePermissions([{id: message.guild.roles.everyone.id, deny: ["SEND_MESSAGES"]}])
            return message.channel.send(this.client.bulbutils.translate("lockdown_locked", {channel}))
        } else {
            await channel.overwritePermissions([{id: message.guild.roles.everyone.id, allow: ["SEND_MESSAGES"]}])
            return message.channel.send(this.client.bulbutils.translate("lockdown_unlocked", {channel}))
        }
    }
}