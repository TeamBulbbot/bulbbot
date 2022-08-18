import Event from "../../structures/Event";
import { Message } from "discord.js";
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
		if (!message.guild) {
			return;
		}
		await Promise.allSettled([databaseManager.addToMessageToDB(message), AutoMod(this.client, message)]);
	}
}
