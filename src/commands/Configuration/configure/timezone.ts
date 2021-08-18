import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "timezone",
			aliases: ["zone"],
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["timezone:string"],
			usage: "<zone>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const timezone: string = args[0].toUpperCase();

		if (!this.client.bulbutils.timezones[timezone])
			return message.channel.send(
				await this.client.bulbutils.translate("event_message_args_missing_list", message.guild?.id, {
					argument: timezone,
					arg_expected: "timezone:string",
					argument_list: "",
				}),
			);

		await databaseManager.setTimezone(<Snowflake>message.guild?.id, timezone);
		await message.channel.send(await this.client.bulbutils.translate("config_timezone_success", message.guild?.id, { timezone }));
	}
}
