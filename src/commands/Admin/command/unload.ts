import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";

export default class extends SubCommand {

	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "unload",
			aliases: ["u"],
			minArgs: 1,
			maxArgs: -1,
			argList: ["command:Command"],
			usage: "<command> [subcommand...]",
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		let command: Command | undefined = Command.resolve(this.client, args);

		if(!command) return;
		if(command instanceof SubCommand) {
			command.parent.subCommands.splice(command.parent.subCommands.findIndex(sc => sc === command), 1);
		} else {
			this.client.commands.delete(command.name);
		}
		command.aliases.forEach(alias => this.client.aliases.delete(alias));

		this.client.log.client(`[CLIENT - COMMANDS] Unloaded command "${command.qualifiedName}"`);
		await message.channel.send(`Unloaded command \`${command.qualifiedName}\``); // needs TL?
	}
}
