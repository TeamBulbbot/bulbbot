import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "roles_on_leave",
            aliases: ["rolesonleave"],
			minArgs: 1,
			maxArgs: 1,
			argList: ["enabled:boolean"],
			usage: "<true|false>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const enabled = args[0].toLowerCase();
		if (enabled !== "true" && enabled !== "false")
			return await context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					arg_provided: args[0],
					arg_expected: "enabled:boolean",
					usage: this.usage,
				}),
			);

		await databaseManager.setRolesOnLeave(<Snowflake>context.guild?.id, enabled === "true");
		await context.channel.send(
			await this.client.bulbutils.translate("config_generic_success", context.guild?.id, {
				setting: "roles_on_leave",
				value: enabled,
			}),
		);
	}
}
