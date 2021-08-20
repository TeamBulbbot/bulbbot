import BulbBotClient from "./BulbBotClient";
import CommandException from "./exceptions/CommandException";
import Command from "./Command";
import CommandOptions from "../utils/types/CommandOptions";
import CommandContext from "./CommandContext";

export type SubCommandClass = typeof SubCommand;
export default class SubCommand extends Command {
	public readonly parent: Command;

	get qualifiedName() {
		return `${this.parent.qualifiedName} ${this.name}`;
	}

	constructor(client: BulbBotClient, parent: Command, options: CommandOptions = { name: "missing name" }) {
		super(client, { // inherit some metadata if none provided
			name: options.name,
			aliases: options.aliases,
			usage: options.usage,
			argList: options.argList,
			examples: options.examples,
			minArgs: options.minArgs,
			maxArgs: options.maxArgs,
			subCommands: options.subCommands,
			category: options.category || parent.category,
			clearance: options.clearance || parent.clearance,
			userPerms: options.userPerms || parent.userPerms,
			clientPerms: options.clientPerms || parent.clientPerms,
			devOnly: options.devOnly || parent.devOnly,
			subDevOnly: options.subDevOnly || parent.subDevOnly,
			premium: options.premium || parent.premium,
			description: options.description || parent.description,
		});
		this.parent = parent;
	}

	public async run(message: CommandContext, args: string[]): Promise<any> {
		if (!args.length || !this.subCommands.length) throw new CommandException(`SubCommand \`${this.qualifiedName}\` doesn't provide a run method!`);
		return super.run(message, args);
	}
}
