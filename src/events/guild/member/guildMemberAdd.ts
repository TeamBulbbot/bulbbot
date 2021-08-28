import Event from "../../../structures/Event";
import { GuildMember, Util } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(member: GuildMember): Promise<void> {
		await loggingManager.sendEventLog(
			this.client,
			member.guild,
			"joinleave",
			Util.removeMentions(
				await this.client.bulbutils.translate("event_member_joined", member.guild.id, {
					user: member.user,
					user_age: Math.floor(member.user.createdTimestamp / 1000),
				}),
			),
		);

		if (member.pending) return;

		const config = await databaseManager.getConfig(member.guild.id);
		if (!config["autorole"]) return;

		await member.roles.add(config["autorole"]);
	}
}
