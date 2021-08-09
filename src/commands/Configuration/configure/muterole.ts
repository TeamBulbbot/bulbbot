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
			name: "mute_role",
			aliases: ["muterole"],
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["role:Role"],
			usage: "<role>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		let role: string = args[0];

		if (role === "remove") await databaseManager.setMuteRole(<Snowflake>message.guild?.id, null);
		else {
			role = role.replace(NonDigits, "");

			const rTemp: Role = <Role>message.guild?.roles.cache.get(role);
			if (rTemp === undefined)
				return message.channel.send(
					await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
						type: await this.client.bulbutils.translateNew("global_not_found_types.role", message.guild?.id, {}),
						arg_provided: args[0],
						arg_expected: "role:Role",
						usage: this.usage,
					}),
				);
			if (message.guild?.me?.roles.highest && message.guild?.me?.roles.highest.rawPosition < rTemp.rawPosition)
				return message.channel.send(await this.client.bulbutils.translateNew("config_mute_unable_to_manage", message.guild?.id, {}));

			await databaseManager.setMuteRole(<Snowflake>message.guild?.id, rTemp.id);
		}

		await message.channel.send(await this.client.bulbutils.translateNew("config_mute_success", message.guild?.id, {}));
	}
}
