const {CommandException} = require("./exceptions/CommandException");
const {Permissions} = require("discord.js")

module.exports = class Command {
    constructor(client, name, options = {}) {
        this.client = client
        this.name = options.name || name
        this.aliases = options.aliases || [];
        this.description = options.description || "No description provided"
        this.category = options.category || "Miscellaneous"
        this.usage = options.usage || "No usage provided"
        this.userPerms = new Permissions(options.userPerms).freeze()
        this.clientPerms = new Permissions(options.clientPerms).freeze()
        this.clearance = options.clearance || 0
    }

    async run(message, args) {
        throw new CommandException(`Command ${this.name} doesn't contain a run method!`)
    }
}