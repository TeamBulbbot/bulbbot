import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { CommandInteraction, Message } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionTypes, ApplicationCommandType } from "../../utils/types/ApplicationCommands";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.CHAT_INPUT,
			description: "Returns information about the characters provided",
			options: [{ name: "characters", type: ApplicationCommandOptionTypes.STRING, description: "The characters you want to info", required: true }],
		});
	}

	public async run(interaction: CommandInteraction) {
		const categories: string[] = [
			"Cc",
			"Zs",
			"Po",
			"Sc",
			"Ps",
			"Pe",
			"Sm",
			"Pd",
			"Nd",
			"Lu",
			"Sk",
			"Pc",
			"Ll",
			"So",
			"Lo",
			"Pi",
			"Cf",
			"No",
			"Pf",
			"Lt",
			"Lm",
			"Mn",
			"Me",
			"Mc",
			"Nl",
			"Zl",
			"Zp",
			"Cs",
			"Co",
		];

		const chars: string = interaction.options.getString("characters") as string;
		let text = "";

		for (let i = 0; i < chars.length; i++) {
			categories.forEach((cat) => {
				const Unicode = require(`unicode/category/${cat}`);
				const charCode = Unicode[chars[i].charCodeAt(0)];
				if (charCode !== undefined) return (text += `${chars[i]} - ${charCode.value} | ${charCode.name}\n`);
				return "";
			});
		}
		if (text === "") text = "Unable to find any data about the given character(s)";
		else if (text.length >= 1000) text = text.substring(0, 1000) + "...";

		return interaction.reply(`\`\`\`${text}\`\`\``);
	}
}

export class lol extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns information about the characters provided",
			category: "Information",
			usage: "<characters>",
			examples: ["charinfo 🍰"],
			argList: ["characters:String"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const categories: string[] = [
			"Cc",
			"Zs",
			"Po",
			"Sc",
			"Ps",
			"Pe",
			"Sm",
			"Pd",
			"Nd",
			"Lu",
			"Sk",
			"Pc",
			"Ll",
			"So",
			"Lo",
			"Pi",
			"Cf",
			"No",
			"Pf",
			"Lt",
			"Lm",
			"Mn",
			"Me",
			"Mc",
			"Nl",
			"Zl",
			"Zp",
			"Cs",
			"Co",
		];

		const chars: string = args.join(" ");
		let text = "";

		for (let i = 0; i < chars.length; i++) {
			categories.forEach((cat) => {
				const Unicode = require(`unicode/category/${cat}`);
				const charCode = Unicode[chars[i].charCodeAt(0)];
				if (charCode !== undefined) return (text += `${chars[i]} - ${charCode.value} | ${charCode.name}\n`);
				return "";
			});
		}
		if (text === "") text = "Unable to find any data about the given character(s)";
		else if (text.length >= 1000) text = text.substring(0, 1000) + "...";

		return context.channel.send(`\`\`\`${text}\`\`\``);
	}
}
