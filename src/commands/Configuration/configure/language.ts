import SubCommand from "../../../structures/SubCommand";
import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import CommandContext from "../../../structures/CommandContext";
import { Message, Snowflake } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "language",
			clearance: 75,
			minArgs: 1,
			maxArgs: 1,
			argList: ["language:string"],
			usage: "<language>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const language: string = args[0].toLowerCase();
		const languageCode: string = this.client.bulbutils.languages[language];

		if (!languageCode)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.lang", context.guild?.id, {}),
					arg_expected: "language:string",
					arg_provided: language,
					usage: this.usage,
				}),
			);

		await databaseManager.setLanguage(<Snowflake>context.guild?.id, languageCode);
		await context.channel.send(
			await this.client.bulbutils.translate("config_generic_success", context.guild?.id, {
				setting: "language",
				value: languageCode,
			}),
		);
	}
}
