import { ThreadChannel } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {});
	}

	async run(thread: ThreadChannel) {
		const autoArchiveDuration = this.client.bulbutils.resolveThreadArchiveDuration(thread.autoArchiveDuration, thread);
		const log: string = await this.client.bulbutils.translate("event_thread_create", thread.guild.id, {
			thread,
			thread_archive: `<t:${Math.round(Date.now() / 1000) + autoArchiveDuration * 60}:f>`,
		});

		await loggingManager.sendEventLog(this.client, thread.guild, "thread", log);
	}
}
