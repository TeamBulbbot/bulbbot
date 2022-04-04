import Event from "../../structures/Event";
import { Guild } from "discord.js";

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(guild: Guild): Promise<void> {
		this.client.log.warn(`[GUILD - UNAVAILABLE]: ${guild.name} (${guild.id}) became unavailable`);
	}
}
