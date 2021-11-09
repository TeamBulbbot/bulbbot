import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Collection, Guild, Message, TextChannel } from "discord.js";
import moment from "moment";
import * as fs from "fs";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "all",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["amount:int"],
			usage: "<number>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let amount: number = Number(args[0]);
		if (Number(amount) > 200) return await context.channel.send(await this.client.bulbutils.translate("purge_too_many", context.guild?.id, {}));
		if (Number(amount) < 2 || isNaN(amount)) return await context.channel.send(await this.client.bulbutils.translate("purge_too_few", context.guild?.id, {}));
		let deleteMsg: number[] = [];
		let a: number = 0;

		for (let i = 1; i <= amount; i++) {
			if (i % 100 === 0) {
				deleteMsg.push(100);
				a = i;
			}
		}
		if (amount - a !== 0) deleteMsg.push(amount - a);

		let delMsgs: string = `Message purge in #${(<TextChannel>context.channel).name} (${context.channel.id}) by ${context.author.tag} (${context.author.id}) at ${moment().format(
			"MMMM Do YYYY, h:mm:ss a",
		)} \n`;

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs: Collection<string, Message> = await context.channel.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(m => {
				if (moment(m.createdAt).isBefore(moment().subtract(14, "days"))) msgs.delete(m.id);
				delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
			});

			amount = msgs.size;

			await (<TextChannel>context.channel).bulkDelete(msgs);
		}

		const client: BulbBotClient = this.client;
		fs.writeFile(`${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, delMsgs, async function (err) {
			if (err) console.error(err);

			await loggingManager.sendModActionFile(client, <Guild>context.guild, "Purge", amount, `${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, context.channel, context.author);
		});

		await context.channel.send(await this.client.bulbutils.translate("purge_success", context.guild?.id, { count: amount }));
	}
}
