const DatabaseManager = new (require("../../../utils/database/DatabaseManager"))();

module.exports = async (client, message, args) => {
	const timezone = args[1].toUpperCase();

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

	await DatabaseManager.setTimezone(message.guild.id, timezone);
	message.channel.send(await client.bulbutils.translate("config_timezone_success", message.guild.id, { zone: timezone }));
};
