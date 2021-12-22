import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Guild, GuildChannel, Message, TextChannel } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "join",
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
			usage: "<guildID>",
			description: "Creates an invite to the first text channel of the specified guild",
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

		// @ts-ignore
		let channel: TextChannel = guild.channels.cache.map((c: GuildChannel) => {
			if (c.type === "GUILD_TEXT") return c;
		});

		const invite = await channel[0].createInvite({
			maxAge: 0,
			maxUses: 1,
			reason: `[Developer] ${context.author.tag} created this invite to the first channel`,
			unique: true,
		});

		context.channel.send(`Created an invite to **${guild.name}**\nhttps://discord.gg/${invite?.code}`);
	}
}
