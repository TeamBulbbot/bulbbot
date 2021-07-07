import Event from "../../structures/Event";
import { Guild, GuildAuditLogs, GuildAuditLogsEntry, User } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import LoggingManager from "../../utils/managers/LoggingManager";

const infractionsManager: InfractionsManager = new InfractionsManager();
const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true
		});
	}

	public async run(guild: Guild, target: User): Promise<void> {
		if (!guild.me?.hasPermission("VIEW_AUDIT_LOG")) return;

		const auditLogs: GuildAuditLogs = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_REMOVE" });
		const banLog: GuildAuditLogsEntry = <GuildAuditLogsEntry>auditLogs.entries.first();

		if (!banLog) return;

		let { executor, reason } = banLog;
		if (executor.id === this.client.user.id) return;
		if (reason === null) reason = await this.client.bulbutils.translate("global_no_reason", guild.id, {});

		await infractionsManager.createInfraction(guild.id, "Manual Unban", true, <string>reason, target, executor);
		const infID: number = await infractionsManager.getLatestInfraction(guild.id, executor.id, target.id, "Manual Unban")
		await loggingManager.sendModAction(this.client, guild.id, "manually unbanned", target, executor, <string>reason, infID)
	}
}