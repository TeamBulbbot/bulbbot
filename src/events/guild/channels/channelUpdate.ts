import Event from "../../../structures/Event";
import { GuildAuditLogs, TextChannel, Permissions } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(newChannel: TextChannel): Promise<void> {
		if (!newChannel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

		const logs: GuildAuditLogs<"CHANNEL_UPDATE"> = await newChannel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_UPDATE" });
		const first = logs.entries.first();
		if (!first) return;

		const { executor, changes, createdTimestamp } = first;
		if (createdTimestamp + 3000 < Date.now()) return;
		if (!changes) return;

		const log: string[] = [];

		for (const change of changes) {
			log.push(
				await this.client.bulbutils.translate("event_change", newChannel.guild.id, {
					part: change.key,
					before: change.old ? change.old : "none",
					after: change.new ? change.new : "none",
				}),
			);
		}

		await loggingManager.sendEventLog(
			this.client,
			newChannel.guild,
			"channel",
			await this.client.bulbutils.translate("event_update_channel", newChannel.guild.id, {
				moderator: executor!,
				channel: newChannel,
				type: await this.client.bulbutils.translate(`channel_types.${newChannel.type}`, newChannel.guild.id, {}),
				changes: log.join("\n> "),
			}),
		);
	}
}
