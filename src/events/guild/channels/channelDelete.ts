import { DMChannel, GuildAuditLogs, GuildChannel, Permissions } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";
import { LoggingConfiguration } from "../../../utils/types/DatabaseStructures";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {});
	}

	async run(channel: DMChannel | GuildChannel) {
		if (!(channel instanceof GuildChannel)) return;

		const config: LoggingConfiguration = await databaseManager.getLoggingConfig(channel.guild.id);
		switch (channel.id) {
			case config.modAction:
				await databaseManager.setModAction(channel.guild.id, null);
				break;
			case config.banpool:
				await databaseManager.setBanpool(channel.guild.id, null);
				break;
			case config.automod:
				await databaseManager.setAutoMod(channel.guild.id, null);
				break;
			case config.message:
				await databaseManager.setMessage(channel.guild.id, null);
				break;
			case config.role:
				await databaseManager.setRole(channel.guild.id, null);
				break;
			case config.member:
				await databaseManager.setMember(channel.guild.id, null);
				break;
			case config.channel:
				await databaseManager.setChannel(channel.guild.id, null);
				break;
			case config.thread:
				await databaseManager.setThread(channel.guild.id, null);
				break;
			case config.invite:
				await databaseManager.setInvite(channel.guild.id, null);
				break;
			case config.joinLeave:
				await databaseManager.setJoinLeave(channel.guild.id, null);
				break;
			case config.other:
				await databaseManager.setOther(channel.guild.id, null);
				break;
		}

		let log = "";
		if (channel.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) {
			const logs: GuildAuditLogs<"CHANNEL_DELETE"> = await channel.guild.fetchAuditLogs({ limit: 1, type: "CHANNEL_DELETE" });
			const first = logs.entries.first();
			if (first) {
				const { executor, createdTimestamp } = first;
				if (Date.now() < createdTimestamp + 3000)
					log = await this.client.bulbutils.translate("event_channel_delete_moderator", channel.guild.id, {
						channel,
						moderator: executor || { id: "Unknown ID", tag: "Unknown User" },
						type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
					});
			}
		}

		if (!log)
			log = await this.client.bulbutils.translate("event_channel_delete", channel.guild.id, {
				channel,
				type: await this.client.bulbutils.translate(`channel_types.${channel.type}`, channel.guild.id, {}),
			});

		await loggingManager.sendEventLog(this.client, channel.guild, "channel", log);
	}
}
