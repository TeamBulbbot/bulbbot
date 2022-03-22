import { Guild, Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";
import { writeFile } from "fs";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "info",
			usage: "info <guildID>",
			description: "Gets all of the database information for a guild",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:Snowflake"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[0]);
		} catch (_) {
			context.channel.send(`Unable to find a guild with the ID of \`${args[0]}\``);
			return;
		}

		const data: any = JSON.stringify(await databaseManager.getFullGuildConfig(guild.id), null, 2);

		writeFile(`${__dirname}/../../../../../files/DB-INFO-${context.guild?.id}.json`, data, (err: any) => {
			if (err) console.error(err);
		});

		await context.channel.send({
			content: `Entire database object for **${guild.name}**`,
			files: [`${__dirname}/../../../../../files/DB-INFO-${context.guild?.id}.json`],
		});
	}
}
