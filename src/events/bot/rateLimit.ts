import Event from "../../structures/Event";
import { RateLimitData } from "discord.js";

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(ratelimit: RateLimitData): Promise<void> {
		this.client.log.warn(
			"[CLIENT - RATELIMIT]: ",
			`GLOBAL: ${ratelimit.global} | Timeout: ${ratelimit.timeout} | Limit: ${ratelimit.limit} | Method: ${ratelimit.method} | Path: ${ratelimit.path} | Route: ${ratelimit.route}`,
		);
	}
}
