import Event from "../../../structures/Event";
import { Invite, Guild } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(inv: Invite): Promise<void> {
		if (!inv.guild) return;

		const invite = {
			maxAge: inv.maxAge,
			maxUses: inv.maxUses,
			guild: inv.guild,
			code: inv.code,
			inviter: {
				tag: inv.inviter !== null ? inv.inviter?.tag : "Server Widget",
				id: inv.inviter !== null ? inv.inviter?.id : "N/A",
			},
		};

		const log: string = await this.client.bulbutils.translate("event_invite_create", invite.guild.id, {
			invite,
			expire_time: invite.maxAge === 0 ? "never" : `<t:${Math.round(Date.now() / 1000) + invite.maxAge!}:R>`,
			max_uses: invite.maxUses === 0 ? "unlimited" : invite.maxUses,
		});

		await loggingManager.sendEventLog(this.client, <Guild>invite.guild, "invite", log);
	}
}
