const DatabaseManager = new (require("../../../utils/database/DatabaseManager"))();

module.exports = async (client, message, args) => {
	const prefix = args[1];

	if (!prefix) return message.channel.send(await client.bulbutils.translate("config_prefix_missing_args", message.guild.id));
	if (prefix.length > 255) return message.channel.send(await client.bulbutils.translate("config_prefix_too_long", message.guild.id));

	await DatabaseManager.setPrefix(message.guild.id, prefix);

	message.channel.send(await client.bulbutils.translate("config_prefix_success", message.guild.id, { prefix }));
};
