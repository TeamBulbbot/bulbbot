import Command from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import { embedColor } from "../../structures/Config";
import * as shell from "shelljs";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Returns some useful information about the bot",
			category: "Bot",
			aliases: ["bot"],
			usage: "!about",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message: Message): Promise<void> {
		shell.cd(`${__dirname}/../../../`);
		const commitHash: string = shell.exec(`git rev-parse --short HEAD`, { silent: true }).stdout;
		const commitTime: string = shell.exec(`git log -1 --format=%cd`, { silent: true }).stdout;
		const realCommitTime: string = this.client.bulbutils.formatDays(new Date(commitTime.slice(0, -7)));
		const latency: number = Math.floor(new Date().getTime() - message.createdTimestamp);
		const apiLatency: number = Math.round(this.client.ws.ping);

		let desc: string = `**__Bulbbot Information__**\n`;
		desc += `**Last Commit:**\n**Hash:** \`${commitHash}\`**Time:** ${realCommitTime}\n\n`;
		desc += `**Ping:** \`${latency} ms\`\n**API Latency:** \`${apiLatency} ms\`\n\n`;
		desc +=
			(await this.client.bulbutils.translate("uptime_uptime", message.guild?.id, {
				uptime: this.client.bulbutils.getUptime(this.client.uptime),
			})) + "\n\n";
		desc += `**Supporters**\n`;

		const embed: MessageEmbed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc)
			.addField("Invite", `[Link](https://bulbbot.mrphilip.xyz/invite)`, true)
			.addField("Support", `[Link](https://bulbbot.mrphilip.xyz/discord)`, true)
			.addField("Patreon", `[Link](https://bulbbot.mrphilip.xyz/patreon)`, true)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				<string>message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		await message.channel.send(embed);
	}
}