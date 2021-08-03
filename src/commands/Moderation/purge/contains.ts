import SubCommand from "../../../structures/SubCommand";
import { Collection, Guild, Message, Snowflake, TextChannel } from "discord.js";
import Command from "../../../structures/Command";
import moment from "moment";
import * as fs from "fs";
import LoggingManager from "../../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			name: "contains",
			clearance: 50,
			minArgs: 2,
			maxArgs: 2,
			argList: ["query:string", "amount:int"],
			usage: "!purge user <query> <amount>",
		});
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<void | Message> {
		let amount: number = Number(args[2]);
		if (amount > 100) return message.channel.send(await this.client.bulbutils.translateNew("purge_too_many", message.guild?.id, {}));
		if (amount <= 1 || isNaN(amount)) return message.channel.send(await this.client.bulbutils.translateNew("purge_too_few", message.guild?.id, {}));

		let deleteMsg: number[] = [];
		let a: number = 0;

		for (let i = 1; i <= amount; i++) {
			if (i % 100 === 0) {
				deleteMsg.push(100);
				a = i;
			}
		}
		if (amount - a !== 0) deleteMsg.push(amount - a);

		let delMsgs: string = `Message purge in #${(<TextChannel>message.channel).name} (${message.channel.id}) by ${message.author.tag} (${message.author.id}) at ${moment().format(
			"MMMM Do YYYY, h:mm:ss a",
		)} \n`;

		let messagesToPurge: Snowflake[] = [];
		amount = 0;

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs: Collection<string, Message> = await message.channel.messages.fetch({
				limit: deleteMsg[i],
			});

			const regex: RegExp = new RegExp(`(?:^|\\W)${args[1]}(?:$|\\W)`, "gi");
			msgs.map(async m => {
				if (m.content.match(regex)) {
					delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
					messagesToPurge.push(m.id);
					amount++;
				}
			});
		}

		await (<TextChannel>message.channel).bulkDelete(messagesToPurge);

		fs.writeFile(`${__dirname}/../../../../files/PURGE-${message.guild?.id}.txt`, delMsgs, function (err) {
			if (err) console.error(err);
		});

		await loggingManager.sendModActionFile(this.client, <Guild>message.guild, "Purge", amount, `${__dirname}/../../../../files/PURGE-${message.guild?.id}.txt`, message.channel, message.author);

		await message.channel.send(await this.client.bulbutils.translateNew("purge_success", message.guild?.id, { count: amount }));
	}
}
