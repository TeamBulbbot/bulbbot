import Event from "../../structures/Event";
import { Guild } from "discord.js";

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(guild: Guild): Promise<void> {
		console.log(guild);
	}
}
