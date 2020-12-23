const Command = require("./../../structures/Command")
const { Deafen } = require("../../utils/moderation/actions");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Deafens a member from a Voice Channel they're connected to",
            category: "Moderation",
            usage: "!deafen <user> [reason]",
            argList: ["user:User"],
            minArgs: 1,
            maxArgs: -1,
            clearance: 50,
            userPerms: ["DEAFEN_MEMBERS"],
            clientPerms: ["DEAFEN_MEMBERS"],
        });
    }

    async run(message, args) {
        const targetId = args[0].replace(NonDigits, "");
        let target = message.guild.member(targetId);
        let reason = args.slice(1).join(" ");
        let infId = null;

        if (!reason) reason = this.client.bulbutils.translate("global_no_reason");
        if (!target) return message.channel.send(this.client.bulbutils.translate("global_user_not_found"))
        if (!target.voice.channel) return message.channel.send(this.client.bulbutils.translate("deafen_not_in_voice"))
        if (target.voice.serverDeaf) return message.channel.send(this.client.bulbutils.translate("deafen_already_deaf"))

        infId = await Deafen(this.client,
            message.guild,
            target,
            message.author,
            this.client.bulbutils.translate("global_mod_action_log", {
                action: "Deafened",
                moderator_tag: message.author.tag,
                moderator_id: message.author.id,
                target_tag: target.user.tag,
                target_id: target.user.id,
                reason,
            }),
            reason
        )

        return message.channel.send(
            this.client.bulbutils.translate("deafen_success", {
                target_tag: target.user.tag,
                target_id: target.user.id,
                reason,
                infractionId: infId,
            }),
        )
    }
}