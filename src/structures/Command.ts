import BulbBotClient from "./BulbBotClient";
import { Message } from "discord.js";
import CommandException from "./exceptions/CommandException";
import { Permissions } from "discord.js";
import { SubCommand } from "./SubCommand";

export default class {
	public readonly client: BulbBotClient;
	public readonly name: string;
	public readonly aliases: string[];
	public readonly subCommands: SubCommand[];
	public readonly description: string;
	public readonly category: string;
	public readonly usage: string;
	public readonly examples: string[];
	public readonly userPerms: any;
	public readonly clientPerms: any;
	public readonly clearance: number;
	public readonly subDevOnly: boolean;
	public readonly devOnly: boolean;
	public readonly premium: boolean;
	public readonly maxArgs: number;
	public readonly minArgs: number;
	public readonly argList: string[];

	constructor(client: BulbBotClient, name: string, options: any) {
		this.client = client;
		this.name = options.name || name;
		this.aliases = options.aliases || [];
		this.subCommands = options.subCommands || [];
		this.description = options.description || "No description provided";
		this.category = options.category || "Miscellaneous";
		this.usage = options.usage || "No usage provided";
		this.examples = options.examples || [];
		this.userPerms = new Permissions(options.userPerms).freeze();
		this.clientPerms = new Permissions(options.clientPerms).freeze();
		this.clearance = options.clearance || 0;
		this.subDevOnly = options.subDevOnly || false;
		this.devOnly = options.devOnly || false;
		this.premium = options.premium || false;
		this.maxArgs = options.maxArgs || 0;
		this.minArgs = options.minArgs || 0;
		this.argList = options.argList || [];
	}

	public async run(message: Message, args: string[]): Promise<any> {
		throw new CommandException(`Command ${this.name} doesn't provide a run method!`);
	}
}
