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
			name: "create",
			minArgs: 3,
			maxArgs: -1,
			argList: ["part:string", "name:string", "clearance:number"],
			usage: "<part> <name> <clearance>",
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const part: string = args[0];
		const name: string[] = args.slice(1, -1);
		let clearance: number = Number(args.at(-1));

		if (isNaN(clearance))
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					arg_provided: clearance,
					arg_expected: "clearance:int",
					usage: this.usage,
				}),
			);
		if (clearance <= 0) return context.channel.send(await this.client.bulbutils.translate("override_clearance_less_than_0", context.guild?.id, {}));
		if (clearance >= 100) return context.channel.send(await this.client.bulbutils.translate("override_clearance_more_than_100", context.guild?.id, {}));

		if (clearance > this.client.userClearance) return context.channel.send(await this.client.bulbutils.translate("override_clearance_higher_than_self", context.guild?.id, {}));

		switch (part) {
			case "role":
				if ((await clearanceManager.getCommandOverride(<Snowflake>context.guild?.id, name[0])) !== undefined)
				return await context.channel.send(await this.client.bulbutils.translate("override_already_exists", context.guild?.id, {}));
					const rTemp = context.guild?.roles.cache.get(name[0].replace(NonDigits, ""));
				if (rTemp === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
							arg_provided: args[1],
							arg_expected: "role:Role",
							usage: this.usage,
						}),
					);

				await clearanceManager.createRoleOverride(<Snowflake>context.guild?.id, name[0].replace(NonDigits, ""), clearance);
				break;

			case "command":
				const command = Command.resolve(this.client, name);

				if (command === undefined || command.name === undefined)
					return context.channel.send(
						await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.cmd", context.guild?.id, {}),
							arg_provided: args[1],
							arg_expected: "command:string",
							usage: this.usage,
						}),
					);

				if ((await clearanceManager.getCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName)) !== undefined)
					return await context.channel.send(await this.client.bulbutils.translate("override_already_exists", context.guild?.id, {}));

				await clearanceManager.createCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName, true, clearance);
				break;
			default:
				return context.channel.send(
					await this.client.bulbutils.translate("event_message_args_missing_list", context.guild?.id, {
						arg_expected: "part:string",
						argument: args[0],
						argument_list: "`role`, `command`",
					}),
				);
		}
		await context.channel.send(await this.client.bulbutils.translate("override_create_success", context.guild?.id, { clearance }));
	}
}
