import ApplicationCommand from "../../structures/ApplicationCommand";
import BulbBotClient from "../../structures/BulbBotClient";
import { ApplicationCommandType } from "../../utils/types/ApplicationCommands";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
import * as Config from "../../Config";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			type: ApplicationCommandType.CHAT_INPUT,
			description: "Returns the API and WebSocket latency.",
			client_permissions: ["EMBED_LINKS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		await interaction.reply({ embeds: [new MessageEmbed().setDescription("Ping!")] });

		const pong = await interaction.fetchReply();
		const latency = (pong instanceof Message ? pong.createdTimestamp : parseInt(pong.timestamp)) - interaction.createdTimestamp;
		const apiLatency = Math.round(this.client.ws.ping);

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("ping_latency", interaction.guild?.id, {
					latency_bot: latency,
					latency_ws: apiLatency,
				}),
			)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		await interaction.editReply({ embeds: [embed] });
	}
}
