import { NonDigits } from "../../../../utils/Regex";
import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../../utils/managers/ClearanceManager";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import BulbBotClient from "../../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "delete",
			aliases: ["remove", "rm"],
			minArgs: 2,
			maxArgs: -1,
			argList: ["part:string", "name:string"],
			usage: "<part> <name>",
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		const part = args[0];

		switch (part) {
			case "role":
			{
				const name = args[1];
				if (!(await clearanceManager.getRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""))))
					return message.channel.send(await this.client.bulbutils.translate("override_nonexistent_role", message.guild?.id, { role: name }));

				await clearanceManager.deleteRoleOverride(<Snowflake>message.guild?.id, name.replace(NonDigits, ""));
				break;
			}
			case "command":
			{
				const name = args.slice(1);
				const command = Command.resolve(this.client, name);
				if (!command || command.name === undefined || !(await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, command.qualifiedName)))
					return message.channel.send(await this.client.bulbutils.translate("override_nonexistent_command", message.guild?.id, { command: name.join(" ") }));

				await clearanceManager.deleteCommandOverride(<Snowflake>message.guild?.id, command.qualifiedName);
				break;
			}
			default:
				return message.channel.send(
					await this.client.bulbutils.translate("event_message_args_missing_list", message.guild?.id, {
						arg_expected: "part:string",
						argument: args[0],
						argument_list: "`role`, `command`",
					}),
				);
		}

		await message.channel.send(await this.client.bulbutils.translate("override_remove_success", message.guild?.id, {}));
	}
}
