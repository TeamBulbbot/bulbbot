import BulbBotClient from "../../../structures/BulbBotClient";
import { Message, Snowflake } from "discord.js";
import { NonDigits } from "../../../utils/Regex";
import ClearanceManager from "../../../utils/managers/ClearanceManager";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default async function (client: BulbBotClient, message: Message, args: string[]): Promise<void | Message> {
	const part = args[1];
	const name = args[2];

	if (!["role", "command"].includes(part)) return message.channel.send(await client.bulbutils.translate("override_create_invalid_part", message.guild?.id));
	if (!name) return message.channel.send(await client.bulbutils.translate("override_create_missing_name", message.guild?.id));

	switch (part) {
		case "role":
			if (!(await clearanceManager.getRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""))))
				return message.channel.send(await client.bulbutils.translate("override_remove_non_existent_override_role", message.guild?.id));

			await clearanceManager.deleteRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""));
			break;

		case "command":
			const cTemp = client.commands.get(name.toLowerCase()) || client.commands.get(<string>client.aliases.get(name.toLowerCase()));
			if (!cTemp || !(await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, cTemp.name)))
				return message.channel.send(await client.bulbutils.translate("override_remove_non_existent_override_command", message.guild?.id));

			await clearanceManager.deleteCommandOverride(<Snowflake>message.guild?.id, cTemp.name);
			break;
		default:
			break;
	}

	await message.channel.send(await client.bulbutils.translate("override_remove_success", message.guild?.id));
}
