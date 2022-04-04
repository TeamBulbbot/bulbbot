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
		await loggingManager.sendEventLog(
			this.client,
			thread.guild,
			"thread",
			await this.client.bulbutils.translate("event_thread_delete", thread.guild.id, {
				thread,
			}),
		);
	}
}
