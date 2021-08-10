import Event from "../../../structures/Event";
import { GuildAuditLogs, Invite } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(invite: Invite): Promise<void> {
		if (!invite.guild?.me?.hasPermission("VIEW_AUDIT_LOG")) return;

		const logs: GuildAuditLogs = await invite.guild.fetchAuditLogs({ limit: 1, type: "INVITE_DELETE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, createdTimestamp } = first;
		if (createdTimestamp + 3000 < Date.now()) return;

		const log: string = await this.client.bulbutils.translate("event_invite_delete", invite.guild.id, {
			invite,
			moderator: executor
		});

		await loggingManager.sendEventLog(this.client, invite.guild, "invite", log);
	}
}
