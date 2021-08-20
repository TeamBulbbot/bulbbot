import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import path from "path";

export default class extends SubCommand {

	private isClass(input: any): boolean {
		return typeof input === "function" && typeof input.prototype === "object" && input.toString().substring(0, 5) === "class";
	}

	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "reload",
			aliases: ["r"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["command:Command"],
			usage: "<command>",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let command: Command | undefined = Command.resolve(this.client, args);

		if(!command) return;
		if(command instanceof SubCommand) {
			command.parent.subCommands.splice(command.parent.subCommands.findIndex(sc => sc === command), 1);
		} else {
			this.client.commands.delete(command.name);
		}
		command.aliases.forEach(alias => this.client.aliases.delete(alias));

		const cmdPath: string = `${command.category}\\${command.qualifiedName.replace(/ /g, "\\")}`;
		const commandFile: string = `${process.cwd()}/build/commands/${cmdPath}.js`;
		delete require.cache[require.resolve(commandFile)];
		let { name } = path.parse(commandFile);
		let File = require(commandFile);
		if (!this.isClass(File.default)) return context.channel.send(`Command ${name} is not an instance of Command`);

		const loadedCommand = new File.default(this.client, name);
		// any SubCommand is-a Command
		if (!(loadedCommand instanceof Command)) return context.channel.send(`Event ${name} doesn't belong in commands!`);
		if(command instanceof SubCommand) {
			command.parent.subCommands.push(<SubCommand>loadedCommand);
		} else {
			this.client.commands.set(loadedCommand.name, loadedCommand);
			if (loadedCommand.aliases.length) {
				for (const alias of loadedCommand.aliases) {
					this.client.aliases.set(alias, loadedCommand.name);
				}
			}
		}
		this.client.log.client(`[CLIENT - COMMANDS] Reloaded command "${loadedCommand.qualifiedName}"`);
		return context.channel.send(`Reloaded command \`${loadedCommand.qualifiedName}\``)
	}
}
