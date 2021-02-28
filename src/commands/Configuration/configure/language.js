const { ChangeLanguage } = require("../../../utils/configuration/GuildConfiguration");
const fs = require("fs");

module.exports = async (client, message, args) => {
	const language = args[1];

	if (!language) return message.channel.send(await client.bulbutils.translate("event_message_args_missing", {
		arg: "language:string",
		arg_expected: 1,
		arg_provided: 0,
		usage: "!configure language <language>"
	}));

	const validLangs = [];
	fs.readdirSync(__dirname + "/../../../languages").forEach(f => {
		validLangs.push(f.split(".")[0]);
	});

	if (!validLangs.includes(language))
		return message.channel.send(
			await client.bulbutils.translate("config_language_invalid_args", {
				languages: validLangs.join(", "),
			}),
		);

	await ChangeLanguage(message.guild.id, language);
	message.channel.send(await client.bulbutils.translate("config_language_success", { language }));
};
