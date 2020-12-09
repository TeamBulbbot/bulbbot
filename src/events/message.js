const Event = require("../structures/Event")

module.exports = class extends Event {
    constructor(...args) {
        super(...args);
    }

    async run(message) {
        const mentionRegex = RegExp(`^<@!${this.client.user.id}>`)
        const mentionRegexPrefix = RegExp(`^<@${this.client.user.id}>`)

        if (!message.guild || message.author.bot) return;

        if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is ${this.client.prefix}`)

        const prefix = message.content.match(mentionRegexPrefix) ?
            message.content.match(mentionRegexPrefix)[0] : this.client.prefix;

        const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)

        const command = this.client.commands.get(cmd.toLowerCase()) || this.client.commands.get(this.client.aliases.get(cmd.toLowerCase()))
        if (command) {
            command.run(message, args)
        }
    }
}