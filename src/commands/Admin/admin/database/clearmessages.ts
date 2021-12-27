import { Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";

const { purgeAllMessagesOlderThan30Days }: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "clearmessages",
			usage: "clearmessages",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		const count = await purgeAllMessagesOlderThan30Days();

		context.channel.send(`Successfully deleted \`${count}\` messages from the database`);
	}
}
