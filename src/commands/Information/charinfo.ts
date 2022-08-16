import { CommandInteraction } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";

export default class CharInfo extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.ChatInput,
			description: "Returns information about the characters provided",
			options: [
				{
					name: "characters",
					type: ApplicationCommandOptionType.String,
					description: "The characters you want to info",
					required: true,
				},
			],
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
