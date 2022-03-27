import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Collection, Guild, Message, TextChannel } from "discord.js";
import moment from "moment";
import { writeFileSync } from "fs";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "until",
			clearance: 50,
			minArgs: 1,
			maxArgs: 1,
			argList: ["message:Snowflake"],
			usage: "<message>",
			description: "Purges messages until a message",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let amount = 0;
		let deletedAmount = 0;
		let msg: Message;
		let deletedMessage = false;
		let temp: number;

		let delMsgs = `Message purge in #${(<TextChannel>context.channel).name} (${context.channel.id}) by ${context.author.tag} (${context.author.id}) at ${moment().format(
			"MMMM Do YYYY, h:mm:ss a",
		)} \n`;
		const twoWeeksAgo = moment().subtract(14, "days").unix();

		try {
			msg = await context.channel.messages.fetch(args[0]);
		} catch (error) {
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.message", context.guild?.id, {}),
					arg_expected: "message:Message",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		}

		while (amount < 500) {
			temp = 0;
			let msgs: Collection<string, Message> = await context.channel.messages.fetch({
				limit: 100,
			});

			const found = msgs.find(m => {
				temp++;
				return m.id === msg.id;
			});
			if (found) {
				deletedMessage = true;
				msgs = await context.channel.messages.fetch({
					limit: temp,
				});
				deletedAmount += temp;
				amount = 500;
			} else deletedAmount += 100;
			msgs.map(m => {
				if (moment(m.createdAt).unix() < twoWeeksAgo) msgs.delete(m.id);
				delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
			});
			await (<TextChannel>context.channel).bulkDelete(msgs);
			amount += 100;
		}
		if (!deletedMessage) return context.channel.send(await this.client.bulbutils.translate("purge_message_failed_to_delete", context.guild?.id, {}));
		writeFileSync(`${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, delMsgs);
		await loggingManager.sendModActionFile(this.client, <Guild>context.guild, "purge", deletedAmount, `${__dirname}/../../../../files/PURGE-${context.guild?.id}.txt`, context.channel, context.author);

		await context.channel.send(await this.client.bulbutils.translate("purge_success", context.guild?.id, { count: deletedAmount }));
	}
}
