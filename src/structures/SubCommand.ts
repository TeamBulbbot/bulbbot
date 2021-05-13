import BulbBotClient from "./BulbBotClient";
import { Message } from "discord.js";
import CommandException from "./exceptions/CommandException";
import Command from "./Command";

export class SubCommand {
	public readonly client: BulbBotClient;
	public readonly parent: Command;
	public readonly name: string;
	public readonly aliases: string[];
	public readonly clearance: number;
	public readonly premium: boolean;
	public readonly minArgs: number;
	public readonly maxArgs: number;
	public readonly argList: string[];
	public readonly usage: string;

	constructor(client: BulbBotClient, parent: Command, name: string, options: any) {
		this.client = client;
		this.parent = parent;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.clearance = options.clearance || 0;
		this.premium = options.premium || false;
		this.minArgs = options.minArgs || -1;
		this.maxArgs = options.maxArgs || 0;
		this.argList = options.argList || [];
		this.usage = options.usage || "";
	}

	public async run(message: Message, parent: Command, args: string[]): Promise<any> {
		throw new CommandException(`SubCommand ${this.name} doesn't provide a run method!`);
	}
}
