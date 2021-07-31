import SubCommand from "../../../structures/SubCommand";
import { Guild, Message, User } from "discord.js";
import Command from "../../../structures/Command";
import * as Emotes from "../../../emotes.json";
import { NonDigits } from "../../../utils/Regex";

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "leave",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
			usage: "!admin leave <guildID>",
		});
	}

	public async run(message: Message, _: Command, args: string[]): Promise<void | Message> {
		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[1]);
		} catch (_) {
			message.channel.send(`Unable to find a guild with the ID of \`${args[1]}\``);
			return;
		}

		let msg = message.channel.send(`Are you sure you want the bot to leave **${guild.name}**?`);
		(await msg).react(Emotes.other.SUCCESS.replace(NonDigits, ""));
		(await msg).react(Emotes.other.FAIL.replace(NonDigits, ""));

		const filter = (reaction: any, user: User) => {
			return [Emotes.other.SUCCESS.replace(NonDigits, ""), Emotes.other.FAIL.replace(NonDigits, "")].includes(reaction.emoji.id) && user.id === message.author.id;
		};

		(await msg)
			.awaitReactions(filter, {
				max: 1,
				time: 60000,
				errors: ["time"],
			})
			.then(async (collected: any) => {
				const reaction = collected.first();
				if (reaction.emoji.id === Emotes.other.SUCCESS.replace(NonDigits, "")) {
					guild.leave();
					(await msg).reactions.removeAll();
					return message.channel.send("Sir yes sir, bot yeeted");
				} else {
					(await msg).reactions.removeAll();
					return message.channel.send("Operation canceled");
				}
			});
	}
}
