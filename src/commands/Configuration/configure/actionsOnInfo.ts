import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "actions_on_info",
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["enabled:boolean"],
			usage: "<true|false>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		if (args[0] !== "true" && args[0] !== "false")
			return await message.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", message.guild?.id, {
					arg_provided: args[0],
					arg_expected: "enabled:boolean",
					usage: this.usage,
				}),
			);

		await databaseManager.setActionsOnInfo(<Snowflake>message.guild?.id, args[0] === "true");
		await message.channel.send(
			await this.client.bulbutils.translate("config_generic_success", message.guild?.id, {
				setting: "actions_on_info",
				value: args[0],
			}),
		);
	}
}
