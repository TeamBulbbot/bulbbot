import BulbBotClient from "./BulbBotClient";
import { Message } from "discord.js";
import CommandException from "./exceptions/CommandException";
import Command from "./Command";

export default class SubCommand extends Command {
	public readonly parent: Command;

	constructor(client: BulbBotClient, parent: Command, name: string, options: any) {
		if(typeof name === "object" && options === undefined) {
			options = name;
			name = options.name;
		}
		super(client, name, options);
		this.parent = parent;
	}

	public async run(message: Message, args: string[]): Promise<any> {
		throw new CommandException(`SubCommand ${this.name} doesn't provide a run method!`);
	}
}
