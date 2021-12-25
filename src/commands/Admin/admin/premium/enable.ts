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
			name: "enable",
			usage: "enable <guildID>",
			description: "Enables premium for a guild",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// enables the premium of a guild

		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[0]);
		} catch (_) {
			context.channel.send(`Unable to find a guild with the ID of \`${args[0]}\``);
			return;
		}

		this.client.log.info(`[DEVELOPER] ${context.author.tag} (${context.author.id}) enabled premium on ${guild.name} (${guild.id})`);
		await databaseManager.setPremium(guild.id, true);
		await context.channel.send(`Enabled premium for **${guild.name}** \`(${guild.id})\``);
	}
}
