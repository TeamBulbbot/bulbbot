const Command = require("../../structures/Command");
const Discord = require("discord.js");
const shell = require("shelljs");
const moment = require("moment");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Returns some useful information about the bot",
			category: "Bot",
			aliases: ["bot"],
			usage: "!about",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message) {
		//

		shell.cd(`${__dirname}/../../../`);
		const commitHash = shell.exec(`git rev-parse --short HEAD`, { silent: true }).stdout;
		const commitTime = shell.exec(`git log -1 --format=%cd`, { silent: true }).stdout;
		const realCommitTime = this.client.bulbutils.formatDays(new Date(commitTime.slice(0, -7)));
		const latency = Math.floor(new Date().getTime() - message.createdTimestamp);
		const apiLatency = Math.round(this.client.ws.ping);

		let desc = `**__Bulbbot Information__**\n`;
		desc += `**Last Commit:**\n**Hash:** \`${commitHash}\`**Time:** ${realCommitTime}\n\n`;
		desc += `**Ping:** \`${latency} ms\`\n**API Latency:** \`${apiLatency} ms\`\n\n`;
		desc +=
			(await this.client.bulbutils.translate("uptime_uptime", message.guild.id, { uptime: this.client.bulbutils.getUptime(this.client.uptime) })) +
			"\n\n";
		desc += `**Supporters**\n`;

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(desc)
			.addField("Invite", `[Link](https://bulbbot.mrphilip.xyz/invite)`, true)
			.addField("Support", `[Link](https://bulbbot.mrphilip.xyz/discord)`, true)
			.addField("Patreon", `[Link](https://bulbbot.mrphilip.xyz/patreon)`, true)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		message.channel.send(embed);
	}
};
