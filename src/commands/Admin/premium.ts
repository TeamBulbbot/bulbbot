import Command from "../../structures/Command";
import { Guild, Message } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import * as Emotes from "../../emotes.json";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Control the premium config of the bot",
			category: "Admin",
			usage: "!premium <action> <guild>",
			examples: ["premium enable 742094927403679816", "premium disable 742094927403679816"],
			minArgs: 2,
			maxArgs: 2,
			argList: ["action:string", "guild:string"],
			devOnly: true,
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[1]);
		} catch (err) {
			await message.channel.send(`${Emotes.other.FAIL} Could not fetch the specified guild!`);
			return;
		}

		switch (args[0].toLowerCase()) {
			case "enable":
				this.client.log.info(`[DEVELOPER] ${message.author.tag} (${message.author.id}) enabled premium on ${guild.name} (${guild.id})`);
				await databaseManager.setPremium(guild.id, true);
				await message.channel.send(`${Emotes.other.SUCCESS} Enabled premium for guild \`${guild.id}\``);
				break;
			case "disable":
				this.client.log.info(`[DEVELOPER] ${message.author.tag} (${message.author.id}) disabled premium on ${guild.name} (${guild.id})`);
				await databaseManager.setPremium(guild.id, false);
				await message.channel.send(`${Emotes.other.SUCCESS} Disabled premium for guild \`${guild.id}\``);
				break;
			default:
				break;
		}
	}
}
