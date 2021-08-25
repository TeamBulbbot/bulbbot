import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns information about the characters provided",
			category: "Information",
			usage: "<characters>",
			examples: ["charinfo 🍰"],
			argList: ["characters:string"],
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
		let text: string = "";

		for (let i = 0; i < chars.length; i++) {
			// @ts-ignore
			categories.forEach(cat => {
				const Unicode = require(`unicode/category/${cat}`);
				const charCode = Unicode[chars[i].charCodeAt(0)];
				if (charCode !== undefined) return (text += `${chars[i]} - ${charCode.value} | ${charCode.name}\n`);
			});
		}
		if (text === "") text = "Unable to find any data about the given character(s)";
		else if (text.length >= 1000) text = text.substring(0, 1000) + "...";

		return context.channel.send(`\`\`\`${text}\`\`\``);
	}
}
