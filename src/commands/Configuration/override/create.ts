import BulbBotClient from "../../../structures/BulbBotClient";
import { Message, Snowflake } from "discord.js";
import { NonDigits } from "../../../utils/Regex";
import ClearanceManager from "../../../utils/managers/ClearanceManager";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default async function (client: BulbBotClient, message: Message, args: string[]): Promise<void | Message> {
	const part: string = args[2];
	const name: string = args[3];
	let clearance: number = Number(args[4]);

	if (!["role", "command"].includes(part)) return message.channel.send(await client.bulbutils.translate("override_create_invalid_part", message.guild?.id));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_create_missing_name", message.guild?.id));
	if (!clearance) return message.channel.send(await client.bulbutils.translate("override_create_missing_clearance", message.guild?.id));
	if (isNaN(clearance)) return message.channel.send(await client.bulbutils.translate("override_create_non_number", message.guild?.id, { clearance: args[4] }));
	if (clearance <= 0) return message.channel.send(await client.bulbutils.translate("override_create_less_than_0", message.guild?.id));
	if (clearance >= 100) return message.channel.send(await client.bulbutils.translate("override_create_more_than_100", message.guild?.id));
	console.log([clearance, client.userClearance]);
	if (clearance > client.userClearance) return message.channel.send(await client.bulbutils.translate("override_create_higher_than_yourself", message.guild?.id));

	if ((await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, name)) !== undefined)
		return await message.channel.send(await client.bulbutils.translate("override_already_exists", message.guild?.id));

	switch (part) {
		case "role":
			const rTemp = message.guild?.roles.cache.get(name.replace(NonDigits, ""));
			if (rTemp === undefined) return message.channel.send(await client.bulbutils.translate("override_create_invalid_role", message.guild?.id));

			await clearanceManager.createRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""), clearance);
			break;

		case "command":
			const command = client.commands.get(name.toLowerCase()) || client.commands.get(<string>client.aliases.get(name.toLowerCase()));
			if (command === undefined) return message.channel.send(await client.bulbutils.translate("override_create_invalid_command", message.guild?.id, { command: name }));

			await clearanceManager.createCommandOverride(<Snowflake>message.guild?.id, command.name, true, clearance);
			break;
		default:
			break;
	}
	await message.channel.send(await client.bulbutils.translate("override_create_success", message.guild?.id, { clearance }));
}
