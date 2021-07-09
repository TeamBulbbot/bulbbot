import Event from "../../../structures/Event";
import { GuildAuditLogs, GuildAuditLogsEntry, GuildMember, User, Util } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";
import InfractionsManager from "../../../utils/managers/InfractionsManager";

const loggingManager: LoggingManager = new LoggingManager();
const infractionsManager: InfractionsManager = new InfractionsManager();

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
				await this.client.bulbutils.translate("event_member_left", member.guild.id, {
					user_tag: member.user.tag,
					user_id: member.user.id,
					user_joined: member.joinedTimestamp,
				}),
			),
		);

		if (!member.guild.me?.hasPermission("VIEW_AUDIT_LOG")) return;

		const auditLogs: GuildAuditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_KICK" });
		const kickLog: GuildAuditLogsEntry = <GuildAuditLogsEntry>auditLogs.entries.first();

		let { executor, reason, target, createdTimestamp } = kickLog
		target = <User>target;
		if (createdTimestamp + 3000 < Date.now()) return;
		if (target.id !== member.user.id) return;

		if (executor.id === this.client.user.id) return;
		if (reason === null) reason = await this.client.bulbutils.translate("global_no_reason", member.guild.id, {});

		await infractionsManager.createInfraction(member.guild.id, "Manual Kick", true, <string>reason, member.user, executor);
		const infID: number = await infractionsManager.getLatestInfraction(member.guild.id, executor.id, target.id, "Manual Kick")
		await loggingManager.sendModAction(this.client, member.guild.id, "manually kicked", member.user, executor, <string>reason, infID)
	}
}
