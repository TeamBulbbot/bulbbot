import Event from "../../../structures/Event";
import { GuildAuditLogs, GuildMember, User, Permissions } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import InfractionsManager from "../../../utils/managers/InfractionsManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();
const loggingManager: LoggingManager = new LoggingManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(member: GuildMember): Promise<void> {
		if (!member.joinedTimestamp) return;

		if (member.roles.cache.size > 1 && (await databaseManager.getConfig(member.guild.id)).rolesOnLeave) {
			await loggingManager.sendEventLog(
				this.client,
				member.guild,
				"joinLeave",
				await this.client.bulbutils.translate("event_member_leave_roles", member.guild.id, {
					user: member.user,
					user_joined: Math.floor(member.joinedTimestamp / 1000),
					user_roles: member.roles.cache.filter(role => role.id !== member.guild.id).map(role => `${role}`).join(", "),
				}),
			);
		} else {
			await loggingManager.sendEventLog(
				this.client,
				member.guild,
				"joinLeave",
					await this.client.bulbutils.translate("event_member_leave", member.guild.id, {
						user: member.user,
						user_joined: Math.floor(member.joinedTimestamp / 1000),
					}),
			);
		}

		if (!member.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const auditLogs: GuildAuditLogs<"MEMBER_KICK"> = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_KICK" });
		const kickLog = auditLogs.entries.first();
		if (!kickLog) return;

		let { executor, reason, target, createdTimestamp } = kickLog;
		target = <User>target;
		if (createdTimestamp + 3000 < Date.now()) return;
		if (target.id !== member.user.id) return;

		if (executor!.id === this.client.user!.id) return;
		if (reason === null) reason = await this.client.bulbutils.translate("global_no_reason", member.guild.id, {});

		await infractionsManager.createInfraction(member.guild.id, "Manual Kick", true, reason, member.user, executor!);
		const infID: number = await infractionsManager.getLatestInfraction(member.guild.id, executor!.id, target.id, "Manual Kick");
		await loggingManager.sendModAction(this.client, member.guild.id, "manually kicked", member.user, executor!, reason, infID);
	}
}
