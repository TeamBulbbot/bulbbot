import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import glob from "glob";
import { promisify } from "util";
import path from "path";

const globAsync = promisify(glob);

export default class extends SubCommand {
	private isClass(input: any): boolean {
		return typeof input === "function" && typeof input.prototype === "object" && input.toString().substring(0, 5) === "class";
	}

	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "load",
			aliases: ["l"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["command:Command"],
			usage: "<command>",
			description: "Loads a command",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const cmd: string = args[0].toLowerCase();
		let cmdFile = "";
		let command: Command | undefined = Command.resolve(this.client, args);
		let dirPath: string;

		if (args.length > 1) {
			if (!command) return context.channel.send(`Cannot load command \`${args[0]}\``);
			if (command.name === args[args.length - 1]) return await context.channel.send(`Already have command \`${command.qualifiedName}\` loaded (did you mean to use \`reload\` instead?)`);
			// TODO: Internally call load command (this command) to attempt to load missing command first
			if (command.name !== args[args.length - 2]) return await context.channel.send(`Cannot load command \`${args.slice(0, command.qualifiedName.split(" ").length + 1).join(" ")}\``);
			cmdFile = args[args.length - 1];
			dirPath = `${process.cwd()}/build/commands/*/${command.qualifiedName.replace(/ /g, "/")}/${cmdFile}.js`;
		} else {
			cmdFile = cmd;
			dirPath = `${process.cwd()}/build/commands/*/${cmdFile}.js`;
		}
		return await globAsync(dirPath).then((commands: any) => {
			mainLoop: for (const commandFile of commands) {
				if (args.length > 1) {
					let currCommand: Command | SubCommand = command!;
					const cmdChain: string[] = new RegExp(`${process.cwd().replace(/\\/g, "/")}/build/commands/(.+)/${cmdFile}\.js`).exec(commandFile)![1].split("/").reverse();
					for (const parent of cmdChain.slice(0, -1)) {
						if (currCommand instanceof SubCommand) {
							if (currCommand.name !== parent) continue mainLoop;
							currCommand = currCommand.parent;
						} else {
							if (currCommand.name !== parent) continue mainLoop;
						}
					}
					if (currCommand.category !== cmdChain[cmdChain.length - 1]) continue mainLoop;
					// Validated path with command parent chain

					delete require.cache[require.resolve(commandFile)];
					const { name } = path.parse(commandFile);
					const File = require(commandFile);
					if (!this.isClass(File.default)) return context.channel.send(`Command ${name} is not an instance of Command`);

					const loadedCommand = new File.default(this.client, command);
					// any SubCommand is-a Command
					if (!(loadedCommand instanceof SubCommand)) return context.channel.send(`Event ${name} doesn't belong in commands!`);
					command!.subCommands.push(loadedCommand);
					command = loadedCommand;
				} else {
					delete require.cache[require.resolve(commandFile)];
					const { name } = path.parse(commandFile);
					const File = require(commandFile);
					if (!this.isClass(File.default)) return context.channel.send(`Command ${name} is not an instance of Command`);

					const loadedCommand = new File.default(this.client, name);
					if (!(loadedCommand instanceof Command)) return context.channel.send(`Event ${name} doesn't belong in commands!`);

					this.client.commands.set(loadedCommand.name, loadedCommand);
					if (loadedCommand.aliases.length) {
						for (const alias of loadedCommand.aliases) {
							this.client.aliases.set(alias, loadedCommand.name);
						}
					}
					command = loadedCommand;
				}
				this.client.log.client(`[CLIENT - COMMANDS] Loaded command "${command.qualifiedName}"`);
				return context.channel.send(`Loaded command \`${command.qualifiedName}\``);
			}
			return context.channel.send(`Cannot load command \`${args.join(" ")}\``);
		});
	}
}
