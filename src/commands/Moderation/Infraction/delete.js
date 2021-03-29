const { deleteInfraction } = require("../../../utils/InfractionUtils");

module.exports = {
	Call: async (client, message, args) => {
		if (!args[1])
			return message.channel.send(
				await client.bulbutils.translate("event_message_args_missing", message.guild.id, {
					arg: "infraction:int",
					arg_expected: 2,
					arg_provided: 1,
					usage: "!infraction delete <infraction>",
				}),
			);

		if (!(await deleteInfraction(message.guild.id, args[1]))) {
			return message.channel.send(
				await client.bulbutils.translate("infraction_not_found", message.guild.id, {
					infractionId: args[1],
				}),
			);
		}

		message.channel.send(
			await client.bulbutils.translate("infraction_delete_success", message.guild.id, {
				infractionId: args[1],
			}),
		);
	},
};
