import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Guild, Message, User } from "discord.js";
import * as Emotes from "../../../emotes.json";
import { NonDigits } from "../../../utils/Regex";
import BulbBotClient from "../../../structures/BulbBotClient";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "leave",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
			usage: "<guildID>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[0]);
		} catch (_) {
			context.channel.send(`Unable to find a guild with the ID of \`${args[0]}\``);
			return;
		}

		let msg = context.channel.send(`Are you sure you want the bot to leave **${guild.name}**?`);
		(await msg).react(Emotes.other.SUCCESS.replace(NonDigits, ""));
		(await msg).react(Emotes.other.FAIL.replace(NonDigits, ""));

		const filter = (reaction: any, user: User) => {
			return [Emotes.other.SUCCESS.replace(NonDigits, ""), Emotes.other.FAIL.replace(NonDigits, "")].includes(reaction.emoji.id) && user.id === context.author.id;
		};

		(await msg).awaitReactions({ filter, max: 1, time: 60000, errors: ["time"] }).then(async (collected: any) => {
			const reaction = collected.first();
			if (reaction.emoji.id === Emotes.other.SUCCESS.replace(NonDigits, "")) {
				guild.leave();
				(await msg).reactions.removeAll();
				return context.channel.send("Sir yes sir, bot yeeted");
			} else {
				(await msg).reactions.removeAll();
				return context.channel.send("Operation canceled");
			}
		});
	}
}
