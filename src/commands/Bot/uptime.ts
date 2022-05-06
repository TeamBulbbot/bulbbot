import { CommandInteraction, MessageEmbed } from "discord.js";
import moment, { Duration } from "moment";
import * as Config from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "../../utils/types/ApplicationCommands";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Shows the bot's uptime.",
			type: ApplicationCommandType.CHAT_INPUT,
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const time: Duration = moment.duration(this.client.uptime, "milliseconds");
		const days: number = Math.floor(time.asDays());
		const hours: number = Math.floor(time.asHours() - days * 24);
		const mins: number = Math.floor(time.asMinutes() - days * 24 * 60 - hours * 60);
		const secs: number = Math.floor(time.asSeconds() - days * 24 * 60 * 60 - hours * 60 * 60 - mins * 60);

		let uptime = "";
		if (days > 0) uptime += `${days} day(s), `;
		if (hours > 0) uptime += `${hours} hour(s), `;
		if (mins > 0) uptime += `${mins} minute(s), `;
		if (secs > 0) uptime += `${secs} second(s)`;

		const embed = new MessageEmbed()
			.setColor(Config.embedColor)
			.setDescription(await this.client.bulbutils.translate("uptime_uptime", interaction.guild?.id, { uptime }))
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
