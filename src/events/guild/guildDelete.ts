import Event from "../../structures/Event";
import { Guild, TextChannel } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { invite } from "../../Config";
import * as Emotes from "../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(guild: Guild): Promise<void> {
		this.client.log.info(`[GUILD] Left a guild ${guild.name} (${guild.id})`);

		await databaseManager.deleteGuild(guild.id);
		(<TextChannel | undefined>this.client.channels.cache.get(invite))?.send(
			`${Emotes.other.LEAVE} Left guild: **${guild.name}** \`(${guild.id})\` owned by <@${guild.ownerId}> \`(${guild.ownerId})\`\nMembers: **${guild.memberCount}**`,
		);
	}
}
