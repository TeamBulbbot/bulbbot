const RemoveCommandOverride = require("../../../utils/clearance/commands/RemoveCommandOverride");
const RemoveModOverride = require("../../../utils/clearance/user/RemoveModOverride");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	const name = args[2];

	if (!["role", "command"].includes(part))
		return message.channel.send(await client.bulbutils.translate("override_create_invalid_part", message.guild.id));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_create_missing_name", message.guild.id));

	switch (part) {
		case "role":
			if (!(await RemoveModOverride(message.guild.id, name.replace(NonDigits, ""))))
				return message.channel.send(await client.bulbutils.translate("override_remove_non_existent_override_role", message.guild.id));
			break;

		case "command":
			const cTemp = client.commands.get(name.toLowerCase()) || client.commands.get(client.aliases.get(name.toLowerCase()));
			if (!cTemp || !(await RemoveCommandOverride(message.guild.id, cTemp.name)))
				return message.channel.send(await client.bulbutils.translate("override_remove_non_existent_override_command", message.guild.id));
			break;
		default:
			break;
	}
	message.channel.send(await client.bulbutils.translate("override_remove_success", message.guild.id));
};
