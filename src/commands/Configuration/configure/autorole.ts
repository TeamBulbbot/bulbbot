import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
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

	public async run(message: Message, args: string[]): Promise<void | Message> {
		let role: Role | null;
		const targetRole = args[0].replace(NonDigits, "");
		role = targetRole ? <Role>await message.guild?.roles.fetch(targetRole).catch(() => null) : null;

		if (!role && args[0] !== "disable")
			return message.channel.send({
				content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.role", message.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "role:Role",
					usage: this.usage,
				}),
				allowedMentions: {
					parse: ["everyone", "roles", "users"],
				},
			});

		if (args[0] !== "disable") {
			if (message.guild?.me?.roles.highest && message.guild?.me.roles.highest.rawPosition < role!!.rawPosition)
				return message.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage", message.guild.id, {}));
		}

		if (role !== undefined) {
			await databaseManager.setAutoRole(<Snowflake>message.guild?.id, role!!.id);
			return message.channel.send(await this.client.bulbutils.translate("config_autorole_success", message.guild?.id, { role: role!!.name }));
		} else {
			await databaseManager.setAutoRole(<Snowflake>message.guild?.id, null);
			return message.channel.send(await this.client.bulbutils.translate("config_autorole_disable", message.guild?.id, {}));
		}
	}
}
