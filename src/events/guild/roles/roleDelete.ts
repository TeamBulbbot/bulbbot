import { Role } from "discord.js";
import Event from "../../../structures/Event";
import LoggingManager from "../../../utils/managers/LoggingManager";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import ClearanceManager from "../../../utils/managers/ClearanceManager";

const loggingManager: LoggingManager = new LoggingManager();
const databaseManager: DatabaseManager = new DatabaseManager();
const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {});
	}

	async run(role: Role) {
		const config = await databaseManager.getConfig(role.guild);
		const roleOverride = await clearanceManager.getRoleOverride(role.guild.id, role.id);

		if (role.id === config.muteRole)
			await databaseManager.updateConfig({
				guild: role.guild,
				table: "guildConfiguration",
				field: "muteRole",
				value: null,
			});
		if (role.id === config.autorole)
			await databaseManager.updateConfig({
				guild: role.guild,
				table: "guildConfiguration",
				field: "autorole",
				value: null,
			});
		if (roleOverride) await clearanceManager.deleteRoleOverride(role.guild.id, role.id);

		// TODO: attempt to fetch executor from audit log
		// Too lazy to do this right now - Kluk
		await loggingManager.sendEventLog(this.client, role.guild, "role", await this.client.bulbutils.translate("event_role_delete", role.guild.id, { role: role }));
	}
}
