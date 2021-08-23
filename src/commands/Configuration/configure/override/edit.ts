import { NonDigits } from "../../../../utils/Regex";
import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../../utils/managers/ClearanceManager";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "edit",
			minArgs: 3,
			maxArgs: -1,
			argList: ["part:string", "name:string", "clearance:number"],
			usage: "<part> <name> <clearance>",
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const part = args[0];
		let clearance = Number(args.at(-1));

		if (isNaN(clearance))
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.int", context.guild?.id, {}),
					arg_expected: "clearance:int",
					arg_provided: args[2],
					usage: this.usage,
				}),
			);
		if (clearance <= 0) return context.channel.send(await this.client.bulbutils.translate("override_clearance_less_than_0", context.guild?.id, {}));
		if (clearance >= 100) return context.channel.send(await this.client.bulbutils.translate("override_clearance_more_than_100", context.guild?.id, {}));
		if (clearance > this.client.userClearance) return context.channel.send(await this.client.bulbutils.translate("override_clearance_higher_than_self", context.guild?.id, {}));

		switch (part) {
			case "role": {
				const name = args[1];
				const roleID = name.replace(NonDigits, "");
				const rTemp = context.guild?.roles.cache.get(roleID);
				if (rTemp === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
							arg_expected: "role:Role",
							arg_provided: args[1],
							usage: this.usage,
						}),
					);

				if ((await clearanceManager.getRoleOverride(<Snowflake>context.guild?.id, rTemp.id)) === undefined)
					return context.channel.send(await this.client.bulbutils.translate("override_nonexistent_role", context.guild?.id, { role: rTemp.name }));
				await clearanceManager.editRoleOverride(<Snowflake>context.guild?.id, roleID, clearance);
				break;
			}

			case "command": {
				const name = args.slice(1, -1);
				const command = Command.resolve(this.client, name);
				if (command === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.cmd", context.guild?.id, {}),
							arg_expected: "command:string",
							arg_provided: name.join(" "),
							usage: this.usage,
						}),
					);

				if ((await clearanceManager.getCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName)) === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("override_nonexistent_command", context.guild?.id, {
							command: command.qualifiedName,
						}),
					);
				await clearanceManager.editCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName, clearance);

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
		await context.channel.send(await this.client.bulbutils.translate("override_edit_success", context.guild?.id, { clearance }));
	}
}
