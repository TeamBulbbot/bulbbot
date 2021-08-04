import SubCommand from "../../../structures/SubCommand";
import { Collection, Guild, Message, Snowflake, TextChannel } from "discord.js";
import moment from "moment";
import * as fs from "fs";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "between",
			clearance: 50,
			minArgs: 2,
			maxArgs: 2,
			argList: ["message1:Snowflake", "message2:Snowflake"],
			usage: "<message1> <message2>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const msgs: Collection<string, Message> = await message.channel.messages.fetch({ limit: 100 });
		const allMessages: Message[] = msgs.map(m => m).reverse();
		const messages: Snowflake[] = [];
		let delMsgs: string = `Message purge in #${(<TextChannel>message.channel).name} (${message.channel.id}) by ${message.author.tag} (${message.author.id}) at ${moment().format(
			"MMMM Do YYYY, h:mm:ss a",
		)} \n`;

		let counting: boolean = false;
		for (let msg of allMessages) {
			if (msg.id === args[0]) {
				counting = true;
			}

			if (counting) {
				messages.push(msg.id);
				delMsgs += `${moment(msg.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${msg.author.tag} (${msg.author.id}) | ${msg.id} | ${msg.content} |\n`;
			}

			if (msg.id === args[1]) counting = false;
		}

		await (<TextChannel>message.channel).bulkDelete(messages);

		fs.writeFile(`${__dirname}/../../../../files/PURGE-${message.guild?.id}.txt`, delMsgs, function (err) {
			if (err) console.error(err);
		});

		await loggingManager.sendModActionFile(
			this.client,
			<Guild>message.guild,
			"Purge",
			messages.length,
			`${__dirname}/../../../../files/PURGE-${message.guild?.id}.txt`,
			message.channel,
			message.author,
		);

		await message.channel.send(await this.client.bulbutils.translateNew("purge_success", message.guild?.id, { count: messages.length }));
	}
}
