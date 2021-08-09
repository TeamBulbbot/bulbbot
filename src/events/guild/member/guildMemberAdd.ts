import Event from "../../../structures/Event";
import { GuildMember, Util } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
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
				await this.client.bulbutils.translateNew("event_member_joined", member.guild.id, {
					user: member.user,
					user_age: Math.floor(member.user.createdTimestamp / 1000),
				}),
			),
		);
	}
}
