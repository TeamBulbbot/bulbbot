import Event from "../../structures/Event";

export default class extends Event {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			once: true,
		});
	}

	async run() {
		this.client.log.info(`[CLIENT] ${this.client.user.username} successfully logged and ready`);
		this.client.log.info(`[CLIENT] Listening to ${this.client.events.size} event(s)`);
		this.client.log.info(`[CLIENT] Listening to ${this.client.commands.size} command(s)`);
	}
}
