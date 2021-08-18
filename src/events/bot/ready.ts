import Event from "../../structures/Event";
import { activityName, type, status } from "../../Config";
import Restoration from "../../utils/Restoration";

const { loadReminders, loadMutes, loadTempBans }: Restoration = new Restoration();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run() {
		this.client.user?.setActivity({
			name: activityName,
			type,
			url: "https://bulbbot.mrphilip.xyz/",
		});

		this.client.user?.setStatus(status);

		await loadReminders(this.client);
		await loadMutes(this.client);
		await loadTempBans(this.client);

		this.client.log.client(`[CLIENT] ${this.client.user!.username} successfully logged and ready`);
		this.client.log.client(`[CLIENT] Listening to ${this.client.events.size} event(s)`);
		this.client.log.client(`[CLIENT] Listening to ${this.client.commands.size} command(s)`);
	}
}
