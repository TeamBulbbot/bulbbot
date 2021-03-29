const { EditCommand } = require("../../../utils/clearance/commands/CommandOverrideUtils");
const { EditMod } = require("../../../utils/clearance/user/ModOverrideUtils");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	const name = args[2];
	let clearance = args[3];

	if (!["role", "command"].includes(part))
		return message.channel.send(await client.bulbutils.translate("override_edit_invalid_part", message.guild.id));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_edit_missing_name", message.guild.id));
	if (!clearance) return message.channel.send(await client.bulbutils.translate("override_edit_missing_clearance", message.guild.id));
	else clearance = parseInt(clearance.replace(NonDigits, ""));
	if (isNaN(clearance))
		return message.channel.send(await client.bulbutils.translate("override_edit_non_number", message.guild.id, { clearance: args[3] }));
	if (clearance <= 0) return message.channel.send(await client.bulbutils.translate("override_edit_less_than_0", message.guild.id));
	if (clearance >= 100) return message.channel.send(await client.bulbutils.translate("override_edit_more_than_100", message.guild.id));
	if (clearance > global.userClearance)
		return message.channel.send(await client.bulbutils.translate("override_edit_higher_than_yourself", message.guild.id));

	switch (part) {
		case "role":
			const rTemp = message.guild.roles.cache.get(name.replace(NonDigits, ""));
			if (rTemp === undefined) return message.channel.send(await client.bulbutils.translate("override_edit_invalid_role", message.guild.id));

			if (!(await EditMod(message.guild.id, name.replace(NonDigits, ""), clearance)))
				return message.channel.send(await client.bulbutils.translate("override_edit_non_existent_override_role", message.guild.id));

			break;

		case "command":
			const command = client.commands.get(name.toLowerCase()) || client.commands.get(client.aliases.get(name.toLowerCase()));
			if (command === undefined)
				return message.channel.send(await client.bulbutils.translate("override_edit_invalid_command", message.guild.id, { command: name }));

			if (!(await EditCommand(message.guild.id, command.name, clearance)))
				return message.channel.send(await client.bulbutils.translate("override_edit_non_existent_override_command", message.guild.id));

			break;
		default:
			break;
	}
	message.channel.send(await client.bulbutils.translate("override_edit_success", message.guild.id, { clearance }));
};
