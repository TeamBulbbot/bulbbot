import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "leave",
			minArgs: 1,
			maxArgs: -1,
			argList: ["pool name:string"],
			usage: "<pool name>",
			clearance: 100,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// todo log in banpool logs (in og and this server) that a serer left the pool
	}
}
