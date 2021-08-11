import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { Message } from "discord.js";
import LoggingSetup from "../../../utils/types/LoggingSetup";
import BulbBotClient from "../../../structures/BulbBotClient";

// @ts-ignore
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "logging",
			clearance: 75,
		});
	}

	public async run(message: Message, args: string[]): Promise<null | LoggingSetup> {
		if (!args.length) {
			await message.channel.send("Welcome to **Bulbbot Logging Setup**.");
			await this.client.bulbutils.sleep(1000);
		}

		return null;
	}
}
