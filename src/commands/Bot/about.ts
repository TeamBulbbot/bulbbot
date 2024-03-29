import { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction } from "discord.js";
import { botInvite, embedColor, supportInvite } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import * as Emotes from "../../emotes.json";
import { NonDigits } from "../../utils/Regex";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandType } from "discord-api-types/v9";
import * as pjson from "../../../package.json";

export default class About extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful information about the bot",
			type: ApplicationCommandType.ChatInput,
			client_permissions: ["EMBED_LINKS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const realCommitTime: string = this.client.bulbutils.formatDays(new Date(this.client.about.build.time.slice(0, -7)));
		const latency: number = Math.floor(Date.now() - interaction.createdTimestamp);
		const apiLatency: number = Math.round(this.client.ws.ping);

		const row = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Invite").setStyle("LINK").setEmoji(Emotes.other.DISCORD.replace(NonDigits, "")).setURL(botInvite),
			new MessageButton().setLabel("Support").setStyle("LINK").setEmoji(Emotes.other.SUPPORT.replace(NonDigits, "")).setURL(supportInvite),
			new MessageButton().setLabel("Patreon").setStyle("LINK").setEmoji(Emotes.other.PATREON.replace(NonDigits, "")).setURL("https://www.patreon.com/bulbbot"),
			new MessageButton().setLabel("Source Code").setStyle("LINK").setEmoji(Emotes.other.GITHUB.replace(NonDigits, "")).setURL("https://github.com/TeamBulbbot/bulbbot"),
		]);

		let desc = `**__Bulbbot Information__**\n`;
		desc += `**Version:** ${pjson.version} (${this.client.about.build.hash.replace("\n", "")})\n\n`;
		desc += `**Last Commit:**\n**Hash:** \`${this.client.about.build.hash}\`**Time:** ${realCommitTime}\n\n`;
		desc += `**Ping:** \`${latency} ms\`\n**API Latency:** \`${apiLatency} ms\`\n\n`;
		desc +=
			(await this.client.bulbutils.translate("uptime_uptime", interaction.guild?.id, {
				uptime: this.client.bulbutils.getUptime(this.client.uptime),
			})) + "\n\n";
		desc += `**Supporters**\n`;

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc)
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed], components: [row] });
	}
}
