import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import BanpoolManager from "../../utils/managers/BanpoolManager";
const { getPools }: BanpoolManager = new BanpoolManager();

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Too be written",
			category: "Moderation",
			aliases: ["poolban"],
			usage: "<user> <force> <reason>",
			examples: ["crossban 123456789012345678 true rude user", "crossban 123456789012345678 false rude user", "crossban 123456789012345678 true rude user"],
			argList: ["user:User", "force:true|false", "reason:string"],
			minArgs: 3,
			maxArgs: -1,
			clearance: 75,
			clientPerms: ["BAN_MEMBERS"],
			premium: true,
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message> {
		console.log(await getPools(context.guild!?.id))
	}
}
