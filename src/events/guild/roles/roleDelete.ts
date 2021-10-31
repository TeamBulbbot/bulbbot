import { Role } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { GuildConfiguration } from "../../../utils/types/GuildConfiguration";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {});
	}

	async run(role: Role) {
		const config: GuildConfiguration = await databaseManager.getConfig(role.guild.id);
		if (role.id === config.muteRole) await databaseManager.setMuteRole(role.guild.id, null);
		else if (role.id === config.autorole) await databaseManager.setAutoRole(role.guild.id, null);

		// TODO: attempt to fetch executor from audit log
		// Too lazy to do this right now - Kluk
		await loggingManager.sendEventLog(this.client, role.guild, "role", await this.client.bulbutils.translate("event_role_delete", role.guild.id, { role: role }));
	}
}
