const Command = require("./../structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            aliases: ["pong"],
        });
    }

    async run(message, args) {
        message.channel.send("Pong")
    }
}