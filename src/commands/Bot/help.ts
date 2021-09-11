import { Message } from "discord.js";
import CommandContext from "src/structures/CommandContext";
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

	async run(context: CommandContext, args: string[]): Promise<Message> {
		const command = Command.resolve(this.client, args);

		if (!command || !await command.validateUserPerms(context))
			return context.channel.send(
				await this.client.bulbutils.translate("help_unable_to_find_command", context.guild!.id, { commandName: args[0] })
			);

		let msg = `**${this.client.prefix}${command.qualifiedName}** ${command.aliases.length !== 0 ? `(${command.aliases.map(alias => `**${alias}**`).join(", ")})` : ""}\n`;
		msg += `> ${command.description}\n\n`;
		msg += `**Usage:** \`${this.client.prefix}${command.usage}\`\n`;

		if (command.examples.length !== 0) {
			msg += `**Examples:**\n`;
			command.examples.forEach(ex => (msg += `\`${this.client.prefix}${ex}\`\n`));
		}

		return context.channel.send(msg);
	}
}
