import { CommandInteraction } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";
import { AnyId } from "../../utils/Regex";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Parse out the Discord id from any text",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "text",
					type: ApplicationCommandOptionType.String,
					description: "The text you want to parse the ids from",
					required: true,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction) {
		const ids = interaction.options.getString("text", true).match(AnyId);

		if (!ids)
			return interaction.reply({
				content: await this.client.bulbutils.translate("id_no_found", interaction.guild?.id, {}),
				ephemeral: true,
			});

		interaction.reply(ids.join("\n"));

		return;
	}
}
