import { Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "enable",
			clearance: 75,
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		await databaseManager.enableAutomod(message.guild!.id, true);
		await message.channel.send(await this.client.bulbutils.translate("automod_enabled", message.guild?.id, {}));
	}
}
