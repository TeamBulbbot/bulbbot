import Command from "../../structures/Command";
import { Message } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import CommandContext from "../../structures/CommandContext";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Configures the bot in your guild",
			category: "Configuration",
			subCommands: [
				/*automod, logging*/
			],
			usage: "[part]",
			clearance: 75,
			maxArgs: 1,
			devOnly: true, // command still WIP
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {

	}
}
