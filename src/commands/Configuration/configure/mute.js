const { ChangeMuteRole } = require("../../../utils/configuration/GuildConfiguration");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	let role = args[1];

	if (!role) return message.channel.send(await client.bulbutils.translate("config_mute_missing_args"));

	if (role === "remove") ChangeMuteRole(message.guild.id, null);
	else {
		role = role.replace(NonDigits, "");

		const rTemp = message.guild.roles.cache.get(role);
		if (rTemp === undefined) return message.channel.send(await client.bulbutils.translate("config_mute_invalid_role"));
		if (message.guild.me.roles.highest.rawPosition < rTemp.rawPosition)
			return message.channel.send(await client.bulbutils.translate("config_mute_unable_to_manage"));

		ChangeMuteRole(message.guild.id, role);
	}

	message.channel.send(await client.bulbutils.translate("config_mute_success"));
};
