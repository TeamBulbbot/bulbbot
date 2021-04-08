const { ChangeTimezone } = require("../../../utils/configuration/GuildConfiguration");
const fs = require("fs");

module.exports = async (client, message, args) => {
	const timezone = args[1];

	if (!timezone)
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_missing", message.guild.id, {
				arg: "timezone:string",
				arg_expected: 1,
				arg_provided: 0,
				usage: "!configure timezone <timezone>",
			}),
		);

	if (!client.bulbutils.timezones[timezone])
		return message.channel.send(
			await client.bulbutils.translate("event_message_args_unexpected_list", message.guild.id, {
				arg: timezone,
				arg_expected: "timezone:string",
				usage: "Visit https://momentjs.com/timezone/ for valid timezones.",
			}),
		);

	await ChangeTimezone(message.guild.id, timezone);
	message.channel.send(await client.bulbutils.translate("config_timezone_success", message.guild.id, { zone: timezone }));
};
