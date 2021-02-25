const CreateCommandOverride = require("../../../utils/clearance/commands/CreateCommandOverride");
const CreateModOverride = require("../../../utils/clearance/user/CreateModOverride");
const { NonDigits } = require("../../../utils/Regex");

module.exports = async (client, message, args) => {
	const part = args[1];
	const name = args[2];
	let clearance = args[3];

	if (!["role", "command"].includes(part)) return message.channel.send(await client.bulbutils.translate("override_create_invalid_part"));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_create_missing_name"));
	if (!clearance) return message.channel.send(await client.bulbutils.translate("override_create_missing_clearance"));
	else clearance = parseInt(clearance.replace(NonDigits, ""));
	if (isNaN(clearance)) return message.channel.send(await client.bulbutils.translate("override_create_non_number", { clearance: args[3] }));
	if (clearance <= 0) return message.channel.send(await client.bulbutils.translate("override_create_less_than_0"));
	if (clearance >= 100) return message.channel.send(await client.bulbutils.translate("override_create_more_than_100"));
	if (clearance > global.userClearance) return message.channel.send(await client.bulbutils.translate("override_create_higher_than_yourself"));

	switch (part) {
		case "role":
			const rTemp = message.guild.roles.cache.get(name.replace(NonDigits, ""));
			if (rTemp === undefined) return message.channel.send(await client.bulbutils.translate("override_create_invalid_role"));

			await CreateModOverride(message.guild.id, name.replace(NonDigits, ""), clearance);
			break;

		case "command":
			const command = client.commands.get(name.toLowerCase()) || client.commands.get(client.aliases.get(name.toLowerCase()));
			if (command === undefined) return message.channel.send(await client.bulbutils.translate("override_create_invalid_command", { command: name }));

			await CreateCommandOverride(message.guild.id, name, true, clearance);
			break;
		default:
			break;
	}
	message.channel.send(await client.bulbutils.translate("override_create_success", { clearance }));
};
