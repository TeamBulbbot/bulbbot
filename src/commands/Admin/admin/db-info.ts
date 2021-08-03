import SubCommand from "../../../structures/SubCommand";
import { Guild, Message } from "discord.js";
import DatabaseManager from "../../../utils/managers/DatabaseManager";
import { writeFile } from "fs";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "db-info",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
			usage: "!admin db-info <guildID>",
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

		const data: any = JSON.stringify(await databaseManager.getFullGuildConfig(guild.id), null, 2);

		writeFile(`${__dirname}/../../../../files/DB-INFO-${message.guild?.id}.json`, data, function (err) {
			if (err) console.error(err);
		});

		await message.channel.send(`Entire database configuration for ${guild.name}`, {
			files: [`${__dirname}/../../../../files/DB-INFO-${message.guild?.id}.json`],
		});
	}
}
