import Event from "../../structures/Event";
import { Guild, GuildAuditLogs, Permissions, User } from "discord.js";
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

	public async run(guild: Guild, target: User): Promise<void> {
		if (!guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const auditLogs: GuildAuditLogs = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" });
		const banLog = auditLogs.entries.first();

		if (!banLog) return;

		let { executor, reason, target: logTarget } = banLog;
		logTarget = <User>logTarget;
		if (executor!.id === this.client.user!.id) return;
		if (target.id !== logTarget.id) return;
		if (reason === null) reason = await this.client.bulbutils.translate("global_no_reason", guild.id, {});

		await infractionsManager.createInfraction(guild.id, "Manual Ban", true, reason, target, executor!);
		const infID: number = await infractionsManager.getLatestInfraction(guild.id, executor!.id, target.id, "Manual Ban");
		await loggingManager.sendModAction(this.client, guild.id, "manually banned", target, executor!, reason, infID);
	}
}
