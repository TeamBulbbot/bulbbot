import { NonDigits } from "../../../utils/Regex";
import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "delete",
			aliases: ["remove", "rm"],
			minArgs: 2,
			maxArgs: 2,
			argList: ["part:string", "name:string"],
			usage: "<part> <name>",
		});
	}

	async run( message: Message, args: string[]): Promise<void | Message> {
		const part = args[0];
		const name = args[1];

		switch (part) {
			case "role":
				if (!(await clearanceManager.getRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""))))
					return message.channel.send(await this.client.bulbutils.translate("override_remove_non_existent_override_role", message.guild?.id));

				await clearanceManager.deleteRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""));
				break;

			case "command":
				const cTemp = this.client.commands.get(name.toLowerCase()) || this.client.commands.get(<string>this.client.aliases.get(name.toLowerCase()));
				if (!cTemp || !(await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, cTemp.name)))
					return message.channel.send(await this.client.bulbutils.translate("override_remove_non_existent_override_command", message.guild?.id));

				await clearanceManager.deleteCommandOverride(<Snowflake>message.guild?.id, cTemp.name);
				break;
			default:
				return message.channel.send(await this.client.bulbutils.translate("override_create_invalid_part", message.guild?.id));
		}

		await message.channel.send(await this.client.bulbutils.translate("override_remove_success", message.guild?.id));
	}
}
