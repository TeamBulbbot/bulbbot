import Event from "../../structures/Event";
import { Message, Permissions } from "discord.js";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import AutoMod from "../../utils/AutoMod";
import CommandContext, { getCommandContext } from "../../structures/CommandContext";

const databaseManager: DatabaseManager = new DatabaseManager();
const clearanceManager: ClearanceManager = new ClearanceManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<any> {
		const context = await getCommandContext(message);

		// checks if the user is in the blacklist
		if (this.client.blacklist.get(context.author.id) !== undefined) return;
		if (!context.guild || context.author.bot) return;

		// checks if the guild is in the blacklist
		if (this.client.blacklist.get(context.guild.id)) return;

		await databaseManager.addToMessageToDB(message);

		let guildCfg = await databaseManager.getConfig(context.guild.id);

		if (!guildCfg) {
			await databaseManager.deleteGuild(context.guild.id);
			await databaseManager.createGuild(context.guild);
			if (!(guildCfg = await databaseManager.getConfig(context.guild.id)))
				return this.safeReply(context, "Please remove and re-add the bot to the server https://bulbbot.rocks/invite, there has been an error with the configuration of the guild");
		}

		const clearance: number = await clearanceManager.getUserClearance(context);

		if (clearance < 25) {
			await AutoMod(this.client, context);
		}
	}

	private async safeReply(context: CommandContext, text: string): Promise<Message | undefined> {
		if (!context.guild?.me?.permissionsIn(context.channel.id).has(Permissions.FLAGS.SEND_MESSAGES)) return;
		return await context.channel.send(text);
	}
}
