import Event from "../../../structures/Event";
import { Invite, Guild } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(invite: Invite): Promise<void> {
		if (!invite.guild) return;

		const log: string = await this.client.bulbutils.translate("event_invite_create", invite.guild.id, {
			invite,
			expire_time: invite.maxAge === 0 ? "never" : `<t:${Math.round(Date.now() / 1000) + invite.maxAge!}:R>`,
			max_uses: invite.maxUses === 0 ? "unlimited" : invite.maxUses,
		});

		await loggingManager.sendEventLog(this.client, <Guild>invite.guild, "invite", log);
	}
}
