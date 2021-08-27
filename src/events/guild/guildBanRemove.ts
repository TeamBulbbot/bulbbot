import Event from "../../structures/Event";
import { GuildAuditLogs, GuildBan, Permissions, User } from "discord.js";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import LoggingManager from "../../utils/managers/LoggingManager";

const infractionsManager: InfractionsManager = new InfractionsManager();
const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(ban: GuildBan): Promise<void> {
		if (!ban.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const auditLogs: GuildAuditLogs = await ban.guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_REMOVE" });
		const banLog = auditLogs.entries.first();

		if (!banLog) return;

		let { executor, reason, target: logTarget } = banLog;
		logTarget = <User>logTarget;
		if (executor!.id === this.client.user!.id) return;
		if (ban.user.id !== logTarget.id) return;
		if (reason === null) reason = await this.client.bulbutils.translate("global_no_reason", ban.guild.id, {});

		await infractionsManager.createInfraction(ban.guild.id, "Manual Unban", true, reason, ban.user, executor!);
		const infID: number = await infractionsManager.getLatestInfraction(ban.guild.id, executor!.id, ban.user.id, "Manual Unban");
		await loggingManager.sendModAction(this.client, ban.guild.id, "manually unbanned", ban.user, executor!, reason, infID);
	}
}
