import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Guild, Message, Role, Snowflake } from "discord.js";
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
			description: "Sets the role that will be used to mute users.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let role: string = args[0];

		if (role === "remove") await databaseManager.setMuteRole(<Snowflake>context.guild?.id, null);
		else {
			role = role.replace(NonDigits, "");

			const rTemp: Role | null | undefined = await this.client.bulbfetch.getRole(context.guild?.roles, role);
			if (!rTemp)
				return context.channel.send(
					await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
						type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
						arg_provided: args[0],
						arg_expected: "role:Role",
						usage: this.usage,
					}),
				);

			if (context.guild?.me?.roles.highest && context.guild?.me?.roles.highest.rawPosition < rTemp.rawPosition)
				return context.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage", context.guild?.id, {}));

			await databaseManager.setMuteRole(<Snowflake>context.guild?.id, rTemp.id);
			await this.client.bulbutils.updateChannelsWithMutedRole(<Guild>context.guild, rTemp.id);
		}

		await context.channel.send(await this.client.bulbutils.translate("config_mute_success", context.guild?.id, {}));
	}
}
