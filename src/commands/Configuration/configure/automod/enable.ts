import BulbBotClient from "../../../../structures/BulbBotClient";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import { Message } from "discord.js";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "enable",
			clearance: 75,
			description: "Enables automod in this server.",
		});
	}

	public async run(context: CommandContext): Promise<void | Message> {
		await databaseManager.enableAutomod(context.guild!.id, true);
		await context.channel.send(await this.client.bulbutils.translate("automod_enabled", context.guild?.id, {}));
	}
}
