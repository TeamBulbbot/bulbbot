import SubCommand from "../../../structures/SubCommand";
import { Guild, Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "db-reset",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
			usage: "!admin db-reset <guildID>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[1]);
		} catch (_) {
			message.channel.send(`Unable to find a guild with the ID of \`${args[1]}\``);
			return;
		}

		await databaseManager.deleteGuild(guild.id);
		await databaseManager.createGuild(guild);

		message.channel.send(`Succesfully reseted **${guild.name}**`);
	}
}
