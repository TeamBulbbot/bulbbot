const { ChangePrefix } = require("../../../utils/configuration/GuildConfiguration");

module.exports = async (client, message, args) => {
	const prefix = args[1];

	if (!prefix) return message.channel.send(await client.bulbutils.translate("config_prefix_missing_args"));

	ChangePrefix(message.guild.id, prefix);

	message.channel.send(await client.bulbutils.translate("config_prefix_success", { prefix }));
};
