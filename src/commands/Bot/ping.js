const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Return the Websocket and API latency",
			category: "Bot",
			usage: "!ping",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message, args) {
		const latency = Math.floor(new Date().getTime() - message.createdTimestamp);
		const apiLatency = Math.round(this.client.ws.ping);

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("ping_latency", message.guild.id, {
					latency_bot: latency,
					latency_ws: apiLatency,
				}),
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
