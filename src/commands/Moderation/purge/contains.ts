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
			name: "contains",
			clearance: 50,
			minArgs: 2,
			maxArgs: 2,
			argList: ["query:string", "amount:int"],
			usage: "<query> <amount>",
			description: "Purges messages containing the query.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let amount: number = Number(args[1]);
		if (amount >= 500) return context.channel.send(await this.client.bulbutils.translate("purge_too_many", context.guild?.id, {}));
		if (amount < 2 || isNaN(amount)) return context.channel.send(await this.client.bulbutils.translate("purge_too_few", context.guild?.id, {}));

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

			const regex: RegExp = new RegExp(`(?:^|\\W)${args[0]}(?:$|\\W)`, "gi");
			msgs.map(async m => {
				if (moment(m.createdAt).unix() < twoWeeksAgo) msgs.delete(m.id);
				if (m.content.match(regex)) {
					delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
					messagesToPurge.push(m.id);
					amount++;
				}
			});
		}

		await (<TextChannel>context.channel).bulkDelete(messagesToPurge);

		writeFileSync(`${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, delMsgs);

		await loggingManager.sendModActionFile(this.client, <Guild>context.guild, "purge", amount, `${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, context.channel, context.author);

		await context.channel.send(await this.client.bulbutils.translate("purge_success", context.guild?.id, { count: amount }));
	}
}
