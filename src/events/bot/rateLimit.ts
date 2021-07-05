import Event from "../../structures/Event";
import { RateLimitData } from "discord.js";

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(ratelimit: RateLimitData): Promise<void> {
		console.info("[CLIENT RATELIMIT]: ", ratelimit);
	}
}
