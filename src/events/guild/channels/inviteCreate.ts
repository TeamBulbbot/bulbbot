import Event from "../../../structures/Event";
import { Invite } from "discord.js";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(invite: Invite): Promise<void> {
		if (!invite.guild) return;

		const log: string = await this.client.bulbutils.translate("event_invite_create", invite.guild.id, {
			code: invite.code,
			expire_time: invite.maxAge === 0 ? "never" : `<t:${Math.round(+new Date() / 1000) + invite.maxAge!}:R>`,
			max_uses: invite.maxUses === 0 ? "unlimited" : invite.maxUses,
			user_id: invite.inviter?.id,
			user_tag: invite.inviter?.tag,
		});

		// the thign is idk which db thing this is tied to to and kluk is sleeping so no one I can ask :(
		await loggingManager.sendServerEventLog(this.client, invite.guild, log);
	}
}
