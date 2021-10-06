import { DMChannel, Guild, GuildAuditLogs, GuildChannel, Permissions, Snowflake } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {});
	}

	async run(channel: DMChannel | GuildChannel) {
		if (!(channel instanceof GuildChannel)) return;

		let msg: string = "";
		if (channel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			const logs: GuildAuditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_CREATE" });
			const first = logs.entries.first();
			if (first) {
				const { executor, createdTimestamp } = first;
				if (Date.now() < createdTimestamp + 3000)
					msg = await this.client.bulbutils.translate("event_channel_create_moderator", channel.guild.id, {
						channel,
						moderator: executor,
						type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
					});
			}
		}

		if (!msg)
			msg = await this.client.bulbutils.translate("event_channel_create", channel.guild.id, {
				channel,
				type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
			});

		const muteRole = await databaseManager.getMuteRole(channel.guild.id);
		if (muteRole) await this.client.bulbutils.updateChannelsWithMutedRole(<Guild>channel.guild, <Snowflake>muteRole);

		await loggingManager.sendEventLog(this.client, channel.guild, "channel", msg);
	}
}
