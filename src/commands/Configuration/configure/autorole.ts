import { SubCommand } from "../../../structures/SubCommand";
import { Message, Role, Snowflake } from "discord.js";
import Command from "../../../structures/Command";
import { NonDigits } from "../../../utils/Regex";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "auto_role",
			aliases: ["autorole"],
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["role:Role"],
			usage: "!configure auto_role <role>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		let role: Role | null = null;
		if (args[1] !== "disable") {
			role = <Role>message.guild?.roles.cache.get(args[1].replace(NonDigits, ""));
			if (message.guild?.me?.roles.highest && message.guild?.me.roles.highest.rawPosition < role!!.rawPosition)
				return message.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage", message.guild.id));
		}
		if (role === undefined) return message.channel.send(await this.client.bulbutils.translate("config_mute_invalid_role", message.guild?.id));

		if (role !== null) {
			await databaseManager.setAutoRole(<Snowflake>message.guild?.id, role.id);
			return message.channel.send(await this.client.bulbutils.translate("config_autorole_success", message.guild?.id));
		} else {
			await databaseManager.setAutoRole(<Snowflake>message.guild?.id, null);
			return message.channel.send(await this.client.bulbutils.translate("config_autorole_disable", message.guild?.id));
		}
	}
}
