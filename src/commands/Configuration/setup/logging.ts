import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import LoggingSetup from "../../../utils/types/LoggingSetup";

// @ts-ignore
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "logging",
			clearance: 75,
			description: "Setup logging for the bot.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<null | LoggingSetup> {
		if (!args.length) {
			await context.channel.send("Welcome to **Bulbbot Logging Setup**.");
			await this.client.bulbutils.sleep(1000);
		}

		return null;
	}
}
