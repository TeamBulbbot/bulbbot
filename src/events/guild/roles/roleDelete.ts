import { Role } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {});
	}

	async run(role: Role) {
        // TODO: attempt to fetch executor from audit log
		await loggingManager.sendEventLog(this.client, role.guild, "role", await this.client.bulbutils.translate("event_role_delete", role.guild.id, { role: role }));
	}
}
