import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import { botInvite, embedColor, supportInvite } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";
import * as Emotes from "../../emotes.json";
import { NonDigits } from "../../utils/Regex";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful information about the bot",
			category: "Bot",
			aliases: ["bot"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext): Promise<void> {
		const realCommitTime: string = this.client.bulbutils.formatDays(new Date(this.client.about.build.time.slice(0, -7)));
		const latency: number = Math.floor(new Date().getTime() - context.createdTimestamp);
		const apiLatency: number = Math.round(this.client.ws.ping);

		const row = new MessageActionRow().addComponents([
			new MessageButton().setLabel("Invite").setStyle("LINK").setEmoji(Emotes.other.DISCORD.replace(NonDigits, "")).setURL(botInvite),
			new MessageButton().setLabel("Support").setStyle("LINK").setEmoji(Emotes.other.SUPPORT.replace(NonDigits, "")).setURL(supportInvite),
			new MessageButton().setLabel("Patreon").setStyle("LINK").setEmoji(Emotes.other.PATREON.replace(NonDigits, "")).setURL("https://bulbbot.mrphilip.xyz/patreon"),
			new MessageButton().setLabel("Source Code").setStyle("LINK").setEmoji(Emotes.other.GITHUB.replace(NonDigits, "")).setURL("https://bulbbot.mrphilip.xyz/github"),
		]);

		const version = Number(this.client.about.buildId.replace("\n", "")) - 782;

		let desc: string = `**__Bulbbot Information__**\n`;
		desc += `**Version:** TS ${(Math.floor(version / 100) + 1 + "" + version).replace(/\B(?=(\d)+(?!\d))/g, ".")} (${this.client.about.build.hash.replace("\n", "")})\n\n`;
		desc += `**Last Commit:**\n**Hash:** \`${this.client.about.build.hash}\`**Time:** ${realCommitTime}\n\n`;
		desc += `**Ping:** \`${latency} ms\`\n**API Latency:** \`${apiLatency} ms\`\n\n`;
		desc +=
			(await this.client.bulbutils.translate("uptime_uptime", context.guild?.id, {
				uptime: this.client.bulbutils.getUptime(this.client.uptime),
			})) + "\n\n";
		desc += `**Supporters**\n`;

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		await context.channel.send({ embeds: [embed], components: [row] });
	}
}
