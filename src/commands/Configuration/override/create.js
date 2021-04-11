const ClearanceManager = new (require("../../../utils/clearance/ClearanceManager"));
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	const name = args[2];
	let clearance = args[3];

	if (!["role", "command"].includes(part))
		return message.channel.send(await client.bulbutils.translate("override_create_invalid_part", message.guild.id));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_create_missing_name", message.guild.id));
	if (!clearance) return message.channel.send(await client.bulbutils.translate("override_create_missing_clearance", message.guild.id));
	else clearance = parseInt(clearance.replace(NonDigits, ""));
	if (isNaN(clearance))
		return message.channel.send(await client.bulbutils.translate("override_create_non_number", message.guild.id, { clearance: args[3] }));
	if (clearance <= 0) return message.channel.send(await client.bulbutils.translate("override_create_less_than_0", message.guild.id));
	if (clearance >= 100) return message.channel.send(await client.bulbutils.translate("override_create_more_than_100", message.guild.id));
	if (clearance > global.userClearance)
		return message.channel.send(await client.bulbutils.translate("override_create_higher_than_yourself", message.guild.id));

	switch (part) {
		case "role":
			const rTemp = message.guild.roles.cache.get(name.replace(NonDigits, ""));
			if (rTemp === undefined) return message.channel.send(await client.bulbutils.translate("override_create_invalid_role", message.guild.id));

			await ClearanceManager.createModOverride(message.guild.id, name.replace(NonDigits, ""), clearance);
			break;

		case "command":
			const command = client.commands.get(name.toLowerCase()) || client.commands.get(client.aliases.get(name.toLowerCase()));
			if (command === undefined)
				return message.channel.send(await client.bulbutils.translate("override_create_invalid_command", message.guild.id, { command: name }));

			await ClearanceManager.createCommandOverride(message.guild.id, command.name, true, clearance);
			break;
		default:
			break;
	}
	message.channel.send(await client.bulbutils.translate("override_create_success", message.guild.id, { clearance }));
};
