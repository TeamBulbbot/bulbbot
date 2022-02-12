import { Guild, Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "reset",
			usage: "reset <guildID>",
			description: "Resets the database for a guild",
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

		await databaseManager.deleteGuild(guild.id);
		await databaseManager.createGuild(guild);

		context.channel.send(`Reseted **${guild.name}**`);
	}
}
