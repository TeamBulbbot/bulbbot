import { NonDigits } from "../../../utils/Regex";
import { Message } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import BulbBotClient from "../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "delete",
			aliases: ["remove", "rm"],
			minArgs: 2,
			maxArgs: -1,
			argList: ["part:String", "name:String"],
			usage: "<part> <name>",
			description: "Removes an override.",
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const part = args[0];

		switch (part) {
			case "role": {
				const name = args[1];
				if (!(await clearanceManager.getRoleOverride(context.guild?.id, name.replace(NonDigits, ""))))
					return context.channel.send(await this.client.bulbutils.translate("override_nonexistent_role", context.guild?.id, { role: name }));

				await clearanceManager.deleteRoleOverride(context.guild?.id, name.replace(NonDigits, ""));
				break;
			}
			case "command": {
				const name = args.slice(1);
				const command = Command.resolve(this.client, name);
				if (!command || command.name === undefined || !(await clearanceManager.getCommandOverride(context.guild?.id, command.qualifiedName)))
					return context.channel.send(await this.client.bulbutils.translate("override_nonexistent_command", context.guild?.id, { command: name.join(" ") }));

				await clearanceManager.deleteCommandOverride(context.guild?.id, command.qualifiedName);
				break;
			}
			default:
				return context.channel.send(
					await this.client.bulbutils.translate("event_message_args_missing_list", context.guild?.id, {
						arg_expected: "part:string",
						argument: args[0],
						argument_list: "`role`, `command`",
					}),
				);
		}

		await context.channel.send(await this.client.bulbutils.translate("override_remove_success", context.guild?.id, {}));
	}
}
