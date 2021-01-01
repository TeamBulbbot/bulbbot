const Command = require("../../structures/Command");
const { createInfraction, deleteInfraction } = require("../../utils/InfractionUtils");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
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
		//const target = await this.client.users.fetch(args[1].replace(NonDigits, ""));
		switch (args[0].toLowerCase()) {
			case "create":
			case "add":
				const id = await createInfraction(
					message.guild.id,
					"ban",
					"false",
					"big sleep",
					target.tag,
					target.id,
					message.author.tag,
					message.author.id,
				);
				message.channel.send("Created an infraction for ``" + target.tag + "`` with the id of ``" + id + "``");
				break;

			case "delete":
			case "remove":
				const inf = args[1];

				if (!args[1])
					return message.channel.send(
						this.client.bulbutils.translate("event_message_args_missing", {
							arg: "infraction:int",
							arg_expected: 2,
							arg_provided: 1,
							usage: "!infraction delete <infraction>",
						}),
					);

				if (!(await deleteInfraction(message.guild.id, inf))) {
					return message.channel.send(
						this.client.bulbutils.translate("infraction_not_found", {
							infractionId: inf,
						}),
					);
				}

				message.channel.send(
					this.client.bulbutils.translate("infraction_delete_success", {
						infractionId: inf,
					}),
				);
				break;

			default:
				break;
		}
	}
};
