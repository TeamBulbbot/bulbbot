const { EditCommand } = require("../../../utils/clearance/commands/CommandOverrideUtils");
const { EditMod } = require("../../../utils/clearance/user/ModOverrideUtils");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	const name = args[2];
	let clearance = args[3];

	if (!["role", "command"].includes(part)) return message.channel.send(await client.bulbutils.translate("override_edit_invalid_part"));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_edit_missing_name"));
	if (!clearance) return message.channel.send(await client.bulbutils.translate("override_edit_missing_clearance"));
	else clearance = parseInt(clearance.replace(NonDigits, ""));
	if (isNaN(clearance)) return message.channel.send(await client.bulbutils.translate("override_edit_non_number", { clearance: args[3] }));
	if (clearance <= 0) return message.channel.send(await client.bulbutils.translate("override_edit_less_than_0"));
	if (clearance >= 100) return message.channel.send(await client.bulbutils.translate("override_edit_more_than_100"));
	if (clearance > global.userClearance) return message.channel.send(await client.bulbutils.translate("override_edit_higher_than_yourself"));

	switch (part) {
		case "role":
			const rTemp = message.guild.roles.cache.get(name.replace(NonDigits, ""));
			if (rTemp === undefined) return message.channel.send(await client.bulbutils.translate("override_edit_invalid_role"));

			if (!(await EditMod(message.guild.id, name.replace(NonDigits, ""), clearance)))
				return message.channel.send(await client.bulbutils.translate("override_edit_non_existent_override_role"));

			break;

		case "command":
			const command = client.commands.get(name.toLowerCase()) || client.commands.get(client.aliases.get(name.toLowerCase()));
			if (command === undefined) return message.channel.send(await client.bulbutils.translate("override_edit_invalid_command", { command: name }));

			if (!(await EditCommand(message.guild.id, command.name, clearance)))
				return message.channel.send(await client.bulbutils.translate("override_edit_non_existent_override_command"));

			break;
		default:
			break;
	}
	message.channel.send(await client.bulbutils.translate("override_edit_success", { clearance }));
};
