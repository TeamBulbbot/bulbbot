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
			name: "mute_role",
			aliases: ["muterole"],
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["role:Role"],
			usage: "!configure mute_role <role>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		let role: string = args[1];

		if (role === "remove") await databaseManager.setMuteRole(<Snowflake>message.guild?.id, null);
		else {
			role = role.replace(NonDigits, "");

			const rTemp: Role = <Role>message.guild?.roles.cache.get(role);
			if (rTemp === undefined)
				return message.channel.send(
					await this.client.bulbutils.translate("global_role_not_found", message.guild?.id, {
						arg_provided: args[1],
						arg_expected: "role:Role",
						usage: "!configure mute_role <role>",
					}),
				);
			if (message.guild?.me?.roles.highest && message.guild?.me?.roles.highest.rawPosition < rTemp.rawPosition)
				return message.channel.send(
					await this.client.bulbutils.translate("global_role_not_found", message.guild?.id, {
						arg_provided: args[1],
						arg_expected: "role:Role",
						usage: "!configure mute_role <role>",
					}),
				);

			await databaseManager.setMuteRole(<Snowflake>message.guild?.id, rTemp.id);
		}

		await message.channel.send(await this.client.bulbutils.translate("config_mute_success", message.guild?.id));
	}
}
