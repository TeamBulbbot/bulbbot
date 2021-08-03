import SubCommand from "../../../structures/SubCommand";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { Message } from "discord.js";
import LoggingSetup from "../../../utils/types/LoggingSetup";
// @ts-ignore
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "logging",
			clearance: 75,
			usage: "setup logging",
		});
	}

	public async run(message: Message, args: string[]): Promise<null | LoggingSetup> {
		if(!args.length) {
			await message.channel.send("Welcome to **Bulbbot Logging Setup**.");
			await this.client.bulbutils.sleep(1000);
		}

		return null;
	}

}
