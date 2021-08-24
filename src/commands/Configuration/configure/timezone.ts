import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "timezone",
			aliases: ["zone", "tz"],
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["timezone:string"],
			usage: "<zone>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const timezone: string = args[0].toUpperCase();

		if (!this.client.bulbutils.timezones[timezone])
			return context.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", context.guild?.id, {
					argument: timezone,
					arg_expected: "timezone:string",
					argument_list: "Find all the timezones at <https://momentjs.com/timezone/>",
				}),
			);

		await databaseManager.setTimezone(<Snowflake>context.guild?.id, timezone);
		await context.channel.send(await this.client.bulbutils.translate("config_timezone_success", context.guild?.id, { timezone }));
	}
}
