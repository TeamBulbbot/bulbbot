const Command = require("../../structures/Command")
const { NonDigits } = require("../../utils/Regex");
const { Warn } = require("../../utils/moderation/actions");

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Warns the selected user",
            category: "Moderation",
            usage: "!warn <user> [reason]",
            argList: ["user:User"],
            minArgs: 1,
            maxArgs: -1,
            clearance: 50,
            userPerms: ["MANAGE_ROLES"],
        });
    }

    async run(message, args) {
        const targetId = args[0].replace(NonDigits, "");
        let target = message.guild.member(targetId);
        let reason = args.slice(1).join(" ");
        let infId = null;

        if (!target) return message.channel.send(this.client.bulbutils.translate("global_user_not_found"))
        if (!reason) reason = this.client.bulbutils.translate("global_no_reason")

        infId = await Warn(this.client,
            message.guild,
            target,
            message.author,
            this.client.bulbutils.translate("global_mod_action_log", {
                action: "Warned",
                moderator_tag: message.author.tag,
                moderator_id: message.author.id,
                target_tag: target.user.tag,
                target_id: target.user.id,
                reason,
            }),
            reason
        )

        return message.channel.send(this.client.bulbutils.translate("warn_success", {
            user_name: target.user.username,
            user_discriminator: target.user.discriminator,
            user_id: target.user.id,
            reason: reason,
            infractionId: infId
        }))
    }
}