import Event from "../../../structures/Event";
import { GuildMember, Snowflake, Util } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import MuteManger from "../../../utils/managers/MuteManger";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();
const { getLatestMute }: MuteManger = new MuteManger();

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
			"joinLeave",
			Util.removeMentions(
				await this.client.bulbutils.translate("event_member_joined", member.guild.id, {
					user: member.user,
					user_age: Math.floor(member.user.createdTimestamp / 1000),
				}),
			),
		);

		if (member.pending) return;

		const mute: Record<string, any> = await getLatestMute(member, member.guild.id);
		if (mute) {
			const muteRole: Snowflake | null = await databaseManager.getMuteRole(member.guild.id);
			if (!muteRole) return;

			await member.roles.add(muteRole);

			await loggingManager.sendModActionPreformatted(
				this.client,
				member.guild,
				await this.client.bulbutils.translate("mute_rejoin", member.guild.id, {
					user: member.user,
				}),
			);
		}

		const config = await databaseManager.getConfig(member.guild.id);
		if (!config["autorole"]) return;

		await member.roles.add(config["autorole"]);
	}
}
