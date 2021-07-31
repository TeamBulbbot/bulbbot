import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import SubCommand from "../../../structures/SubCommand";
import Command from "../../../structures/Command";

// @ts-ignore
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "limit",
			clearance: 75,
			maxArgs: 0,
			usage: "!automod limit",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {

	}
}
