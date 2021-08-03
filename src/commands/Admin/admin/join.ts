import SubCommand from "../../../structures/SubCommand";
import { Guild, Message } from "discord.js";

export default class extends SubCommand {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			name: "join",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
			usage: "admin join <guildID>",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[0]);
		} catch (_) {
			message.channel.send(`Unable to find a guild with the ID of \`${args[0]}\``);
			return;
		}

		const invite = await guild.channels.cache.first()?.createInvite({
			maxAge: 0,
			maxUses: 1,
			reason: `[Developer] ${message.author.tag} created this invite to the first channel`,
			unique: true,
		});

		message.channel.send(`Created an invite to **${guild.name}**\nhttps://discord.gg/${invite?.code}`);
	}
}
