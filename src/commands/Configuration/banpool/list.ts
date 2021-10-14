import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "list",
			clearance: 75,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// well make this works :kek:
		// list all banpools the guild is subscired to + total pool size
	}
}
