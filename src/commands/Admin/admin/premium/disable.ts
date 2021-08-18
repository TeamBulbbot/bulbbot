import { Guild, Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import BulbBotClient from "../../../../structures/BulbBotClient";
import DatabaseManager from "../../../../utils/managers/DatabaseManager";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "disable",
			usage: "disable <guildID>",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		// disables the premium of a guild

		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[0]);
		} catch (_) {
			message.reply(`Unable to find a guild with the ID of \`${args[0]}\``);
			return;
		}

		this.client.log.info(`[DEVELOPER] ${message.author.tag} (${message.author.id}) disabled premium on ${guild.name} (${guild.id})`);
		await databaseManager.setPremium(guild.id, false);
		await message.reply(`Disabled premium for **${guild.name}** \`(${guild.id})\``);
	}
}
