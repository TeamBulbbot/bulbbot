import { DMChannel, GuildChannel } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {});
	}

	async run(channel: DMChannel | GuildChannel) {
		if (!(channel instanceof GuildChannel)) return;
		// TODO: attempt to fetch executor from audit log
		await loggingManager.sendEventLog(this.client, channel.guild, "channel", await this.client.bulbutils.translate("event_channel_create", channel.guild.id, { channel }));
	}
}
