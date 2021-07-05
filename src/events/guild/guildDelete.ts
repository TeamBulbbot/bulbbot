import Event from "../../structures/Event";
import { Guild } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { invite } from "../../Config";
import * as Emotes from "../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(guild: Guild): Promise<void> {
		await databaseManager.deleteGuild(guild.id);
		this.client.channels.cache
			.get(invite)
			.send(`${Emotes.other.LEAVE} Left guild: **${guild.name}** \`(${guild.id})\` owned by <@${guild.ownerID}> \`(${guild.ownerID})\`\nMembers: **${guild.memberCount}**`);
	}
}
