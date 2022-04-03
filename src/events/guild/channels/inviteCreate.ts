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
			// This is a safe coercian to a number. `null` will be 0 if present
			// This only works if you know it will be an integer, however it can be safer
			// than using `+` for coercian, as `+undefined` results in `NaN`
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			maxAge: ~~inv.maxAge!,
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
			expire_time: invite.maxAge === 0 ? "never" : `<t:${Math.round(Date.now() / 1000) + invite.maxAge}:R>`,
			max_uses: invite.maxUses === 0 ? "unlimited" : invite.maxUses,
		});

		// The difference between Guild and InviteGuild doesn't matter here. TODO: maybe widen the parameter type
		await loggingManager.sendEventLog(this.client, invite.guild as Guild, "invite", log);
	}
}
