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
			name: "enable",
			minArgs: 1,
			maxArgs: -1,
			argList: ["command:String"],
			usage: "<command>",
			description: "Enables a command",
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const command = Command.resolve(this.client, args);
		if (!command || command.name === undefined)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.cmd", context.guild?.id, {}),
					arg_expected: "command:string",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		if ((await clearanceManager.getCommandOverride(context.guild?.id, command.qualifiedName)) !== undefined) {
			await clearanceManager.setEnabled(context.guild?.id, command.qualifiedName, true);
		} else {
			return context.channel.send(await this.client.bulbutils.translate("override_nonexistent_command", context.guild?.id, { command: command.qualifiedName }));
		}

		await context.channel.send(await this.client.bulbutils.translate("override_enable_success", context.guild?.id, { command: args.join(" ") }));
	}
}
