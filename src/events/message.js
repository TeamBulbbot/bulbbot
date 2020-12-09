const Event = require("../structures/Event")
const BulbBotUtils = require("./../utils/BulbBotUtils")

module.exports = class extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        const mentionRegex = RegExp(`^<@!?${this.client.user.id}>`)
        const mentionRegexPrefix = RegExp(`^<@!?${this.client.user.id}>`)

        if (!message.guild || message.author.bot) return

        if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is ${this.client.prefix}`)

        const prefix = message.content.match(mentionRegexPrefix) ?
            message.content.match(mentionRegexPrefix)[0] : this.client.prefix

        if (!message.content.startsWith(prefix)) return

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))
        if (command) {

            console.log(command.clearance)
            const userPermCheck = command.userPerms ? this.client.defaultPerms.add(command.userPerms) : this.client.defaultPerms
            if (userPermCheck) {
                const missing = message.channel.permissionsFor(message.member).missing(userPermCheck)
                if (missing.length) {
                    return message.channel.send(BulbBotUtils.translation.translate("global_missing_permission")).then(msg => {
                        message.delete({timeout: 5000})
                        msg.delete({timeout: 5000})
                    })
                }
            }

            const clientPermCheck = command.userPerms ? this.client.defaultPerms.add(command.clientPerms) : this.client.defaultPerms
            if (clientPermCheck) {
                const missing = message.channel.permissionsFor(message.member).missing(clientPermCheck)
                if (missing.length) {
                    return message.channel.send(BulbBotUtils.translation.translate("global_missing_permission_bot"))
                }
            }

            command.run(message, args)
        }
    }
}