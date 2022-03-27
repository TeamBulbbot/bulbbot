import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Collection, Guild, GuildMember, Message, Snowflake, TextChannel } from "discord.js";
import { NonDigits } from "../../../utils/Regex";
import moment from "moment";
import { writeFileSync } from "fs";
import LoggingManager from "../../../utils/managers/LoggingManager";
import BulbBotClient from "../../../structures/BulbBotClient";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "user",
			clearance: 50,
			minArgs: 2,
			maxArgs: 2,
			argList: ["member:Member", "amount:Number"],
			usage: "<member> <amount>",
			description: "Purges a users messages from the current channel.",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let amount = Number(args[1]);
		const user: GuildMember | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, args[0].replace(NonDigits, ""));

		if (!user)
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.member", context.guild?.id, {}),
					arg_expected: "member:Member",
					arg_provided: args[1],
					usage: this.usage,
				}),
			);

		if (amount >= 500) return context.channel.send(await this.client.bulbutils.translate("purge_too_many", context.guild?.id, {}));
		if (amount < 2 || isNaN(amount)) return context.channel.send(await this.client.bulbutils.translate("purge_too_few", context.guild?.id, {}));

		const deleteMsg: number[] = [];
		let a = 0;

		for (let i = 1; i <= amount; i++) {
			if (i % 100 === 0) {
				deleteMsg.push(100);
				a = i;
			}
		}
		if (amount - a !== 0) deleteMsg.push(amount - a);

		let delMsgs = `Message purge in #${(<TextChannel>context.channel).name} (${context.channel.id}) by ${context.author.tag} (${context.author.id}) at ${moment().format(
			"MMMM Do YYYY, h:mm:ss a",
		)} \n`;

		const messagesToPurge: Snowflake[] = [];
		amount = 0;

		const twoWeeksAgo = moment().subtract(14, "days").unix();

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs: Collection<string, Message> = await context.channel.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(async (m) => {
				if (moment(m.createdAt).unix() < twoWeeksAgo) msgs.delete(m.id);
				if (user.user.id === m.author.id) {
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
