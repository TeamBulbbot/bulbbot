import Event from "../../structures/Event";
import { Guild, Message, Permissions } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import AutoMod from "../../utils/AutoMod";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<any> {
		const guildCfg = await databaseManager.getConfig(message.guild as Guild);
		await databaseManager.addToMessageToDB(message);

		if (guildCfg === undefined) {
			await databaseManager.deleteGuild(message.guild as Guild);
			await databaseManager.getGuild(message.guild as Guild);
			if (!(await databaseManager.getConfig(message.guild as Guild)))
				return this.safeReply(message, "Please remove and re-add the bot to the server https://bulbbot.rocks/invite, there has been an error with the configuration of the guild");
		}

		await AutoMod(this.client, message);
	}

	private async safeReply(message: Message, text: string): Promise<Message | undefined> {
		if (!message.guild?.me?.permissionsIn(message.channel.id).has(Permissions.FLAGS.SEND_MESSAGES)) return;
		return await message.channel.send(text);
	}
}
