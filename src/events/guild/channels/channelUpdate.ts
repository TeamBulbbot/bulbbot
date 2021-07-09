import Event from "../../../structures/Event";
import { GuildAuditLogsEntry, TextChannel } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(newChannel: TextChannel): Promise<void> {
		if (!newChannel.guild.me?.hasPermission("VIEW_AUDIT_LOG")) return;

		const logs = await newChannel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDATE" });
		const first: GuildAuditLogsEntry = <GuildAuditLogsEntry>logs.entries.first();

		const { executor, changes, createdTimestamp } = first;
		if (createdTimestamp + 5000 < Date.now()) return;
		if (!changes) return;

		let log: string = "";

		for (const change of changes) {
			log +=
				(await this.client.bulbutils.translate("event_change", newChannel.guild.id, {
					part: change.key,
					before: change.old ? change.old : null,
					after: change.new ? change.new : null,
				})) + ", ";
		}

		log = log.replace(/, +$/, "");

		await loggingManager.sendServerEventLog(
			this.client,
			newChannel.guild,
			await this.client.bulbutils.translate("event_channel_update", newChannel.guild.id, {
				moderator_tag: executor.tag,
				moderator_id: executor.id,
				channel_id: newChannel.id,
				changes: log,
			}),
		);
	}
}
