import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Collection, Guild, Message, Snowflake, TextChannel } from "discord.js";
import moment from "moment";
import { writeFileSync } from "fs";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "between",
			clearance: 50,
			minArgs: 2,
			maxArgs: 2,
			argList: ["message1:Snowflake", "message2:Snowflake"],
			usage: "<context1> <context2>",
			description: "Purges messages between two messages.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const msgs: Collection<string, Message> = await context.channel.messages.fetch({ limit: 100 });
		const allMessages: Message[] = msgs.map(m => m).reverse();
		const messages: Snowflake[] = [];
		let delMsgs: string = `Message purge in #${(<TextChannel>context.channel).name} (${context.channel.id}) by ${context.author.tag} (${context.author.id}) at ${moment().format(
			"MMMM Do YYYY, h:mm:ss a",
		)} \n`;

		let counting: boolean = false;
		const twoWeeksAgo = moment().subtract(14, "days").unix();

		for (let msg of allMessages) {
			if (msg.id === args[0]) {
				counting = true;
			}

			if (counting) {
				if (moment(msg.createdAt).unix() < twoWeeksAgo) msgs.delete(msg.id);
				messages.push(msg.id);
				delMsgs += `${moment(msg.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${msg.author.tag} (${msg.author.id}) | ${msg.id} | ${msg.content} |\n`;
			}

			if (msg.id === args[1]) counting = false;
		}

		await (<TextChannel>context.channel).bulkDelete(messages);

		writeFileSync(`${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, delMsgs);

		await loggingManager.sendModActionFile(
			this.client,
			<Guild>context.guild,
			"purge",
			messages.length,
			`${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`,
			context.channel,
			context.author,
		);

		await context.channel.send(await this.client.bulbutils.translate("purge_success", context.guild?.id, { count: messages.length }));
	}
}
