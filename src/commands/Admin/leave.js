const Command = require("../../structures/Command")

module.exports = class extends Command {
    constructor(...args) {
        super(...args, {
            description: "Leaves the specified guild",
            category: "Admin",
            usage: "!leave <guild>",
            argList: ["guild:Guild"],
            minArgs: 1,
            maxArgs: 1,
            devOnly: true
        });
    }

    async run(message, args) {
        let guild;
        try {
            guild = await this.client.guilds.fetch(args[0])
        } catch(err) {
            return message.channel.send("Could not fetch the specified guild!")
        }

        message.channel.send(`Are you sure you want the bot to leave **${guild.name}**?`).then(msg => {
            msg.react("742096152861868104").then(() => {
                msg.react("742096153172115507")
            })

            const filter = (reaction, user) => {
                return (
                    [
                        "742096152861868104",
                        "742096153172115507"
                    ].includes(reaction.emoji.id) && user.id === message.author.id
                );
            };

            msg.awaitReactions(filter, {
                    max: 1,
                    time: 60000,
                    errors: ["time"],
                }).then(async (collected) => {
                    const reaction = collected.first();

                    if (reaction.emoji.id === "742096152861868104") {
                        guild.leave()
                        await msg.reactions.removeAll()
                        return message.channel.send("Sir yes sir, bot yeeted")
                    } else if (reaction.emoji.id === "742096153172115507") {
                        await msg.reactions.removeAll()
                        return message.channel.send("Operation canceled")
                    }
                })
        })
    }
}