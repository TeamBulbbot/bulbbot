const { getInfraction, setReason } = require("../../../utils/InfractionUtils");

module.exports = {
	Call: async (client, message, args) => {
		if (!args[1])
			return message.channel.send(
				await client.bulbutils.translate("event_message_args_missing", {
					arg: "infraction:int",
					arg_expected: 2,
					arg_provided: 1,
					usage: "!infraction claim <infraction>",
				}),
			);

		if (!(await getInfraction(message.guild.id, args[1]))) {
			return message.channel.send(
				await client.bulbutils.translate("infraction_not_found", {
					infractionId: args[1],
				}),
			);
		}

		const reason = args.slice(2).join(" ");
		await setReason(args[1], reason);
		return message.channel.send(await client.bulbutils.translate("infraction_update_success", { infractionId: args[1] }));
	},
};
