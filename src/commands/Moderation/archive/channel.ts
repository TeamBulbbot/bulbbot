import BulbBotClient from "../../../structures/BulbBotClient";
import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "channel",
			clearance: 50,
			minArgs: 1,
			maxArgs: 2,
			argList: ["channel:Channel", "amount:number"],
			usage: "<channel> [amount]",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		context.channel.send("hi you are in the archive channel command");
	}
}
