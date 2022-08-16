import { CommandInteraction, DeconstructedSnowflake, MessageEmbed, Snowflake, SnowflakeUtil } from "discord.js";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import moment from "moment";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v10";

export default class SnowflakeCommand extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Get information about a snowflake.",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "snowflake",
					type: ApplicationCommandOptionType.String,
					description: "The snowflake to get information about.",
					required: true,
					min_length: 17,
					max_length: 19,
				},
			],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const snowflake: Snowflake = interaction.options.getString("snowflake") as Snowflake;

		const deconstruct: DeconstructedSnowflake = SnowflakeUtil.deconstruct(snowflake);

		let desc = `**❄️ [Snowflake](https://discord.com/developers/docs/reference#snowflakes) information**\n\n`;

		desc += `**Creation:** <t:${moment(deconstruct.date).unix()}:F> (<t:${moment(deconstruct.date).unix()}:R>)\n`;
		desc += `**Timestamp:** ${deconstruct.timestamp}\n`;
		desc += `**Worker Id:** ${deconstruct.workerId}\n`;
		desc += `**Process Id:** ${deconstruct.processId}\n`;
		desc += `**Increment:** ${deconstruct.increment}\n`;
		desc += `**Binary:** ${deconstruct.binary}\n`;

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(desc)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		return interaction.reply({
			embeds: [embed],
		});
	}
}
