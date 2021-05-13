import Event from "../../structures/Event";
import { game, status, type } from "../../structures/Config";
import { PresenceData } from "discord.js";

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run() {
		await this.client.user.setPresence(<PresenceData>{
			status: status,
			activity: {
				name: game,
				type: type,
			},
		});

		console.log(`[CLIENT] ${this.client.user.username} successfully logged and ready`);
		console.log(`[CLIENT] Listening to ${this.client.events.size} event(s)`);
		console.log(`[CLIENT] Listening to ${this.client.commands.size} command(s)`);
	}
}
