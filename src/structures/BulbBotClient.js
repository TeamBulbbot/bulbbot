const { Client, Collection } = require("discord.js")
const Util = require("./Util")

module.exports = class BulbBotClient extends Client {
    constructor(options = {}) {
        super({
            disableMentions: 'everyone'
        });
        this.validate(options)

        this.commands = new Collection()
        this.aliases = new Collection()

        this.events = new Collection()

        this.utils = new Util(this)

        this.on('message', async (message) => {
            const mentionRegex = RegExp(`^<@!${this.user.id}>`)
            const mentionRegexPrefix = RegExp(`^<@${this.user.id}>`)

            if (!message.guild || message.author.bot) return;

            if (message.content.match(mentionRegex)) message.channel.send(`My prefix for ${message.guild.name} is ${this.prefix}`)

            const prefix = message.content.match(mentionRegexPrefix) ?
                message.content.match(mentionRegexPrefix)[0] : this.prefix;

            const [cmd, ...args] = message.content.slice(prefix.length).trim().split(/ +/g)

            const command = this.commands.get(cmd.toLowerCase()) || this.commands.get(this.aliases.get(cmd.toLowerCase()))
            if (command) {
                command.run(message, args)
            }
        });

    }

    validate(options) {
        if (typeof options !== 'object') throw new TypeError("Options must be type of Object!")

        if (!options.token) throw new Error("Client cannot log it without token!")
        this.token = options.token;

        if (!options.prefix) throw new Error("Client cannot log without prefix!")
        if (typeof options.prefix !== 'string') throw new TypeError("Prefix must be type of string!")
        this.prefix = options.prefix
    }

    async login(token = this.token) {
        await this.utils.loadEvents()
        await this.utils.loadCommands()
        await super.login(token)
    }
}