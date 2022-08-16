import { CommandInteraction, MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v9";

export default class License extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns the license file for the Github repo for the bot",
			type: ApplicationCommandType.ChatInput,
			client_permissions: ["EMBED_LINKS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(await this.client.bulbutils.translate("license_license", interaction.guild?.id, {}))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed] });
	}
}
