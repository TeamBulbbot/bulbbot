const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Return the WebSocked and API latency",
			category: "Bot",
			usage: "!ping"
		});
	}

	async run(message, args) {
		const latency = Math.floor(new Date().getTime() - message.createdTimestamp);
		const apiLatency = Math.round(this.client.ws.ping);

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.EMBED_COLOR)
			.setDescription(this.client.bulbutils.translate("ping_latency", { latency_bot: latency, latency_ws: apiLatency }))
			.setFooter(this.client.bulbutils.translate("global_executed_by", { user: message.author }),
				message.author.avatarURL({dynamic: true})
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};
