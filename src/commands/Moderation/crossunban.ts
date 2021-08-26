import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Too be written",
			category: "Moderation",
			aliases: ["poolunban"],
			usage: "<user> <force> <reason> [pool]",
			examples: ["crossunban 123456789012345678 true nice user", "crossunban 123456789012345678 false indeed very nice", "crossunban 123456789012345678 true very-nice raiding-pool"],
			argList: ["user:User", "force:true|false", "reason:string", "pool:string"],
			minArgs: 3,
			maxArgs: -1,
			clearance: 75,
			clientPerms: ["BAN_MEMBERS"],
			premium: true,
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {}
}
