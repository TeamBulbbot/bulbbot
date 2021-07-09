import Event from "../../structures/Event";

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run() {
		console.log(`[CLIENT] ${this.client.user.username} successfully logged and ready`);
		console.log(`[CLIENT] Listening to ${this.client.events.size} event(s)`);
		console.log(`[CLIENT] Listening to ${this.client.commands.size} command(s)`);
	}
}
