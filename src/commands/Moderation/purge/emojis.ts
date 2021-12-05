import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Collection, Guild, Message, Snowflake, TextChannel } from "discord.js";
import moment from "moment";
import { CustomEmote, Emoji } from "../../../utils/Regex";
import * as fs from "fs";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "emojis",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["amount:int"],
			usage: "<number>",
			description: "Purges messages with custom emojis.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let amount: number = Number(args[0]);
		if (amount > 100) return context.channel.send(await this.client.bulbutils.translate("purge_too_many", context.guild?.id, {}));
		if (amount <= 1 || isNaN(amount)) return context.channel.send(await this.client.bulbutils.translate("purge_too_few", context.guild?.id, {}));

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

		let messagesToPurge: Snowflake[] = [];
		amount = 0;

		const twoWeeksAgo = moment().subtract(14, "days").unix();

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs: Collection<string, Message> = await context.channel.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(async m => {
				if (moment(m.createdAt).unix() < twoWeeksAgo) msgs.delete(m.id);
				if (m.content.match(CustomEmote) || m.content.match(Emoji)) {
					delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
					messagesToPurge.push(m.id);
					amount++;
				}
			});
		}

		await (<TextChannel>context.channel).bulkDelete(messagesToPurge);

		fs.writeFile(`${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, delMsgs, function (err) {
			if (err) console.error(err);
		});

		await loggingManager.sendModActionFile(this.client, <Guild>context.guild, "Purge", amount, `${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, context.channel, context.author);

		await context.channel.send(await this.client.bulbutils.translate("purge_success", context.guild?.id, { count: amount }));
	}
}
