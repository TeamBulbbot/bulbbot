import { Message, Snowflake } from "discord.js";
import ClearanceManager from "../../../utils/managers/ClearanceManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import BulbBotClient from "../../../structures/BulbBotClient";

const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "disable",
			minArgs: 1,
			maxArgs: -1,
			argList: ["command:String"],
			usage: "<command>",
			description: "Disables a command",
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const command = Command.resolve(this.client, args);
		if (command === undefined || command.name === undefined)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.cmd", context.guild?.id, {}),
					arg_provided: args.join(" "),
					arg_expected: "command:string",
					usage: this.usage,
				}),
			);

		if ((await clearanceManager.getCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName)) !== undefined) {
			await clearanceManager.setEnabled(<Snowflake>context.guild?.id, command.qualifiedName, false);
		} else {
			await clearanceManager.createCommandOverride(<Snowflake>context.guild?.id, command.qualifiedName, false, command.clearance);
		}

		await context.channel.send(await this.client.bulbutils.translate("override_disable_success", context.guild?.id, { command: command.qualifiedName }));
	}
}
