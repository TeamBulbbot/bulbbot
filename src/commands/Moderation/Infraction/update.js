const { getInfraction, setReason } = require("../../../utils/InfractionUtils");
const { NonDigits } = require("../../../utils/Regex");

module.exports = {
	Call: async (client, message, args) => {
		if (!args[1])
			return message.channel.send(
				await client.bulbutils.translate("event_message_args_missing", message.guild.id, {
					arg: "infraction:int",
					arg_expected: 3,
					arg_provided: 1,
					usage: "!infraction update <infraction> <reason>",
				}),
			);

		if (!(await getInfraction(message.guild.id, args[1].replace(NonDigits, "")))) {
			return message.channel.send(
				await client.bulbutils.translate("infraction_not_found", message.guild.id, {
					infractionId: args[1],
				}),
			);
		}

		const reason = args.slice(2).join(" ");
		await setReason(args[1], reason);
		return message.channel.send(await client.bulbutils.translate("infraction_update_success", message.guild.id, { infractionId: args[1] }));
	},
};
