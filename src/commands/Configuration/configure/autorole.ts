import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, Role, Snowflake } from "discord.js";
import { NonDigits } from "../../../utils/Regex";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "auto_role",
			aliases: ["autorole"],
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["role:Role"],
			usage: "<role>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const targetRole = args[0].replace(NonDigits, "");
		const role: Role | null | undefined = await this.client.bulbfetch.getRole(context.guild?.roles, targetRole);

		if (!role && args[0] !== "disable")
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "role:Role",
					usage: this.usage,
				}),
			);

		if (args[0] !== "disable") {
			if (context.guild?.me?.roles.highest && context.guild?.me.roles.highest.rawPosition < role!!.rawPosition)
				return context.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage", context.guild.id, {}));
		}

		if (role !== undefined && role !== null) {
			await databaseManager.setAutoRole(<Snowflake>context.guild?.id, role!!.id);
			return context.channel.send(await this.client.bulbutils.translate("config_autorole_success", context.guild?.id, { role: role!!.name }));
		} else {
			await databaseManager.setAutoRole(<Snowflake>context.guild?.id, null);
			return context.channel.send(await this.client.bulbutils.translate("config_autorole_disable", context.guild?.id, {}));
		}
	}
}
