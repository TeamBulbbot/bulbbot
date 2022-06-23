import Event from "../../structures/Event";
import { Guild } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { invite } from "../../Config";
import * as Emotes from "../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(guild: Guild): Promise<void> {
		this.client.log.info(`[GUILD] Joined a new guild ${guild.name} (${guild.id})`);

		await databaseManager.getGuild(guild);
		const channel = this.client.channels.cache.get(invite);
		channel?.isText() &&
			channel.send(`${Emotes.other.JOIN} Joined new guild: **${guild.name}** \`(${guild.id})\` owned by <@${guild.ownerId}> \`(${guild.ownerId})\`\nMembers: **${guild.memberCount}**`);
	}
}
