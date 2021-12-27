import Event from "../../../structures/Event";
import { GuildAuditLogs, Invite, Guild, Permissions } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(invite: Invite): Promise<void> {
		// @ts-ignore
		const guild: Guild = invite.guild;
		if (!guild?.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const logs: GuildAuditLogs<"INVITE_DELETE"> = await guild.fetchAuditLogs({ limit: 1, type: "INVITE_DELETE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, createdTimestamp } = first;
		if (createdTimestamp + 3000 < Date.now()) return;

		const log: string = await this.client.bulbutils.translate("event_invite_delete", guild.id, {
			invite,
			moderator: executor,
		});

		await loggingManager.sendEventLog(this.client, guild, "invite", log);
	}
}
