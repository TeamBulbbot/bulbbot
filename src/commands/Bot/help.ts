import { Message } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import Command from "../../structures/Command";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Gets useful information about a given command",
			category: "Bot",
			usage: "<command> [subcommand...]",
			argList: ["command:string"],
			examples: ["help ping"],
			minArgs: 1,
			maxArgs: -1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message, args: string[]) {
		let command: Command = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.get(this.client.aliases.get(args[0].toLowerCase())!)!;

		if (command === undefined || command.devOnly || command.subDevOnly)
			return message.channel.send(
				await this.client.bulbutils.translate("global_not_found", message.guild!.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.cmd", message.guild?.id, {}),
					arg_expected: "command:string",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
		else {
			let currCommand = command;
			let i: number;
			for (i = 1; ; ++i) {
				const commandArgs = args.slice(i);
				currCommand = command;

				if (!command.subCommands.length) break;
				if (i >= args.length) break;
				command = command.resolveSubcommand(commandArgs);
				if (command === currCommand) break;
			}

			let msg = `**${this.client.prefix}${command.qualifiedName}** ${command.aliases.length !== 0 ? `(${command.aliases.map(alias => `**${alias}**`).join(", ")})` : ""}\n`;
			msg += `> ${command.description}\n\n`;
			msg += `**Usage:** \`${this.client.prefix}${command.usage}\`\n`;

			if (command.examples.length !== 0) {
				msg += `**Examples:**\n`;
				command.examples.forEach(ex => (msg += `\`${this.client.prefix}${ex}\`\n`));
			}

			return message.channel.send(msg);
		}
	}
}
