import { DMChannel, GuildAuditLogs, GuildChannel, Permissions } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {});
	}

	async run(channel: DMChannel | GuildChannel) {
		if (!(channel instanceof GuildChannel)) return;

		let msg = "";
		if (channel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			const logs: GuildAuditLogs<"CHANNEL_CREATE"> = await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_CREATE" });
			const first = logs.entries.first();
			if (first) {
				const { executor, createdTimestamp } = first;
				if (Date.now() < createdTimestamp + 3000)
					msg = await this.client.bulbutils.translate("event_channel_create_moderator", channel.guild.id, {
						channel,
						moderator: executor!,
						type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
					});
			}
		}

		if (!msg)
			msg = await this.client.bulbutils.translate("event_channel_create", channel.guild.id, {
				channel,
				type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
			});

		await loggingManager.sendEventLog(this.client, channel.guild, "channel", msg);
	}
}
