const Command = require("../../structures/Command");
const Discord = require("discord.js");
const Emotes = require("../../emotes.json");
const os = require("os");
const process = require("process");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Get analytics on how the bot is performing",
			category: "Admin",
			usage: "!analytics",
			devOnly: true,
		});
	}

	async run(message, args) {
		const procId = process.pid;
		const uptimeS = os.uptime();
		const type = os.type();
		const cpuUsage = process.cpuUsage();

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.addField(
				"Computer",
				`Process ID: \`${procId}\`\n🖥️ OS System: \`${type}\`\n⏰ Uptime: \`${Math.floor(uptimeS / 60)} minutes\`\n${Emotes.other.CPU} CPU Usage: \`${
					cpuUsage.system
				}\``,
			)
			.addField(
				`Discord (1/1)`,
				`${Emotes.other.Discord} Guilds: \`${this.client.guilds.cache.size}\`\n${Emotes.other.Users} Users: \`${this.client.guilds.cache
					.map(g => g.members.cache.filter(m => !m.user.bot).size)
					.reduce((a, b) => a + b)}\`\n${Emotes.other.Robot} Robots: \`${this.client.guilds.cache
					.map(g => g.members.cache.filter(m => m.user.bot).size)
					.reduce((a, b) => a + b)}\``,
			)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};

function delta() {
	const cpus = os.cpus();

	return cpus.map(cpu => {
		const times = cpu.times;
		return {
			tick: Object.keys(times)
				.filter(time => time !== "idle")
				.reduce((tick, time) => {
					tick += times[time];
					return tick;
				}, 0),
			idle: times.idle,
		};
	});
}
