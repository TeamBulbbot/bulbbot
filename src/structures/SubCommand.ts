import BulbBotClient from "./BulbBotClient";
import { Message } from "discord.js";
import CommandException from "./exceptions/CommandException";

export class SubCommand {
	public readonly client: BulbBotClient;
	public readonly name: string;
	public readonly aliases: string[];
	public readonly clearance: number;
	public readonly premium: boolean;

	constructor(client: BulbBotClient, name: string, options: any) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.clearance = options.clearance || 0;
		this.premium = options.premium || false;
	}

	public async run(message: Message, args: string[]): Promise<any> {
		throw new CommandException(`SubCommand ${this.name} doesn't provide a run method!`);
	}
}
