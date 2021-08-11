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
		if (!channel) return;
		if (!(channel instanceof GuildChannel)) return;

		await loggingManager.sendEventLog(this.client, channel.guild, "channel", await this.client.bulbutils.translate("event_channel_create", channel.guild.id, { channel }));
	}
}
