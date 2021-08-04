import BulbBotClient from "./BulbBotClient";
import { Message } from "discord.js";
import CommandException from "./exceptions/CommandException";
import Command from "./Command";
import CommandOptions from "../utils/types/CommandOptions";

export type SubCommandClass = typeof SubCommand;
export default class SubCommand extends Command {
	public readonly parent: Command;

	get qualifiedName() {
		return `${this.parent.qualifiedName} ${this.name}`
	}

	constructor(client: BulbBotClient, parent: Command, options: CommandOptions = {name: "missing name"}) {
		super(client, options);
		this.parent = parent;
	}

	public async run(message: Message, args: string[]): Promise<any> {
		throw new CommandException(`SubCommand \`${this.qualifiedName}\` doesn't provide a run method!`);
	}
}
