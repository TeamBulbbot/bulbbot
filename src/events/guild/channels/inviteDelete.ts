import Event from "../../../structures/Event";
import { GuildAuditLogsEntry, Invite } from "discord.js";
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
		if (!invite.guild) return;
		if (!invite.guild.me?.hasPermission("VIEW_AUDIT_LOG")) return;

		const logs = await invite.guild.fetchAuditLogs({ limit: 1, type: "INVITE_DELETE" });
		const first: GuildAuditLogsEntry = <GuildAuditLogsEntry>logs.entries.first();

		const { executor, createdTimestamp } = first;
		if (createdTimestamp + 3000 < Date.now()) return;
		if (!executor) return;

		const log: string = await this.client.bulbutils.translate("event_invite_delete", invite.guild.id, {
			code: invite.code,
			user_id: executor?.id,
			user_tag: executor?.tag,
		});

		await loggingManager.sendEventLog(this.client, invite.guild, "invite", log);
	}
}
