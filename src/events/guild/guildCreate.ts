import Event from "../../structures/Event";
import { Guild } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(guild: Guild): Promise<void> {
		await databaseManager.createGuild(guild);
		console.log(guild);
	}
}
