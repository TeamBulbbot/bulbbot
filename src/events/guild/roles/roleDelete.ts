import { Role } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {});
	}

	async run(role: Role) {
		const config = await databaseManager.getConfig(role.guild);
		if (role.id === config.autorole)
			await databaseManager.updateConfig({
				guild: role.guild,
				table: "guildConfiguration",
				field: "autorole",
				value: null,
			});

		// TODO: attempt to fetch executor from audit log
		// Too lazy to do this right now - Kluk
		await loggingManager.sendEventLog(this.client, role.guild, "role", await this.client.bulbutils.translate("event_role_delete", role.guild.id, { role: role }));
	}
}
