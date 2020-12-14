const Command = require("../../structures/Command")
const InfractionUtils = require("./../../utils/InfractionUtils")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Bans the selected user from the guild",
            category: "Moderation",
            aliases: ["terminate", "yeet"],
            usage: "!ban <user> [reason]",
            argList: ["user:User"],
            minArgs: 1,
            maxArgs: -1,
            clearance: 50,
            userPerms: ["BAN_MEMBERS"],
            clientPerms: ["BAN_MEMBERS"]
        });
    }

    async run(message, args) {
        const user = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0])).user
        if (!user) return message.channel.send(this.client.bulbutils.translate("global_user_not_found", {user_id: args[0]}))

        let reason = "No reason given"
        if (args[1]) reason = args.slice(1).join(" ");

        await message.guild.members.ban( user, {reason: this.client.bulbutils.translate("global_mod_action_log", {
                moderator_id: message.author.id,
                user_id: user.id,
                reason: reason
            })
        });

        message.channel.send(this.client.bulbutils.translate("ban_success", {
            user_name: user.username,
            user_discriminator: user.discriminator,
            user_id: user.id,
            moderator_name: message.author.username,
            moderator_discriminator: message.author.discriminator,
            moderator_id: message.author.id,
            reason: reason
        }));

        await InfractionUtils.createInfraction(
            message.guild.id,
            "Ban",
            reason,
            user.tag,
            user.id,
            message.author.tag,
            message.author.id
        );
    }
}