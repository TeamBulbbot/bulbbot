const Command = require("../../structures/Command");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Gets useful information about a given command",
			category: "Bot",
			usage: "!help <command>",
			argList: ["command:string"],
			examples: ["help ping"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(message, args) {
		const command = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.get(this.client.aliases.get(args[0].toLowerCase()));

		if (command === undefined || command.devOnly) return message.channel.send("command not found");
		else {
			let msg = `**${this.client.prefix}${command.name}** ${command.aliases.length !== 0 ? `(${command.aliases.join("**,** ")})` : ""}\n`;
			msg += `> ${command.description}\n\n`;
			msg += `**Usage:** \`${command.usage}\`\n`;

			if (command.examples.length !== 0) {
				msg += `**Examples:**\n`;
				command.examples.forEach(ex => (msg += `\`${this.client.prefix}${ex}\`\n`));
			}

			return message.channel.send(msg);
		}
	}
};
