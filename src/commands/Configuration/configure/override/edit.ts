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
			name: "edit",
			minArgs: 3,
			maxArgs: 3,
			argList: ["part:string", "name:string", "clearance:number"],
			usage: "<part> <name> <clearance>",
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		const part = args[0];
		const name = args[1];
		let clearance = Number(args[2]);

		if (isNaN(clearance))
			return message.channel.send(
				await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.int", message.guild?.id, {}),
					arg_expected: "clearance:int",
					arg_provided: args[2],
					usage: this.usage,
				}),
			);
		if (clearance <= 0) return message.channel.send(await this.client.bulbutils.translate("override_clearance_less_than_0", message.guild?.id, {}));
		if (clearance >= 100) return message.channel.send(await this.client.bulbutils.translate("override_clearance_more_than_100", message.guild?.id, {}));
		if (clearance > this.client.userClearance) return message.channel.send(await this.client.bulbutils.translate("override_clearance_higher_than_self", message.guild?.id, {}));

		switch (part) {
			case "role":
				const roleID = name.replace(NonDigits, "");
				const rTemp = message.guild?.roles.cache.get(roleID);
				if (rTemp === undefined)
					return message.channel.send(
						await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.role", message.guild?.id, {}),
							arg_expected: "role:Role",
							arg_provided: args[1],
							usage: this.usage,
						}),
					);

				if ((await clearanceManager.getRoleOverride(<Snowflake>message.guild?.id, rTemp.id)) === undefined)
					return message.channel.send(await this.client.bulbutils.translate("override_nonexistent_role", message.guild?.id, { role: rTemp.name }));
				await clearanceManager.editRoleOverride(<Snowflake>message.guild?.id, roleID, clearance);
				break;

			case "command":
				const command = this.client.commands.get(name.toLowerCase()) || this.client.commands.get(<string>this.client.aliases.get(name.toLowerCase()));
				if (command === undefined)
					return message.channel.send(
						await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
							type: await this.client.bulbutils.translate("global_not_found_types.cmd", message.guild?.id, {}),
							arg_expected: "command:string",
							arg_provided: args[1],
							usage: this.usage,
						}),
					);

				if ((await clearanceManager.getCommandOverride(<Snowflake>message.guild?.id, name)) === undefined)
					return message.channel.send(
						await this.client.bulbutils.translate("override_nonexistent_command", message.guild?.id, {
							command: name,
						}),
					);
				await clearanceManager.editCommandOverride(<Snowflake>message.guild?.id, command.name, clearance);

				break;
			default:
				return message.channel.send(
					await this.client.bulbutils.translate("event_message_args_missing_list", message.guild?.id, {
						arg_expected: "part:string",
						argument: args[0],
						argument_list: "`role`, `command`",
					}),
				);
		}
		await message.channel.send(await this.client.bulbutils.translate("override_edit_success", message.guild?.id, { clearance }));
	}
}
