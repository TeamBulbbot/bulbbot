const Command = require("../../structures/Command");
const {createInfraction} = require("../../utils/InfractionUtils");
const {NonDigits} = require("../../utils/Regex");

module.exports = class extends (
    Command
) {
    constructor(...args) {
        super(...args, {
            description: "Infraction Desc",
            category: "Moderation",
            aliases: ["inf"],
            usage: "!infraction <action>",
            userPerms: ["MANAGE_GUILD"],
            clearance: 50,
            minArgs: 1,
            maxArgs: -1,
            argList: ["action:string"],
        });
    }

    async run(message, args) {
        // TESTING FILE STILL VERY MUCH WORK IN PROGRESS

        const target = await this.client.users.fetch(args[1].replace(NonDigits, ""));
        switch (args[0].toLowerCase()) {
            case "create":
            case "add":
                const id = await createInfraction(message.guild.id, "ban", "big sleep", target.tag, target.id, message.author.tag, message.author.id);
                message.channel.send("Created an infraction for ``" + target.tag + "`` with the id of ``" + id + "``");
                break;

            default:
                break;
        }
    }
};
