const request = require("request");
const Discord = require("discord.js");

module.exports = {
	name: "ri",
	category: "developer",
	description: "Test",
	run: async (_client, message, _args) => {
		let developers = process.env.DEVELOPERS.split(",");
		let url = "http://bit.do/d83VX";
		// ((?:https?:)?\/\/)?((?:www|m)\.)?((?:discord\.gg|discordapp\.gg))+

		let r = [];
		let embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTimestamp()
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			);
		if (developers.includes(message.author.id)) {
			request(
				{
					url: url,
					method: "GET",
					followRedirect: function (response) {
						if (r.length === 0) r.push(`🌀 **${response.request.href}**\n`);
						else r.push(`:arrow_right_hook: ${response.request.href} `);

						return true;
					},
				},
				function (_error, response, _body) {
					r.push(`\n🌐 **${response.request.href}**`);
					embed.setDescription(r);
					return message.channel.send(embed);
				}
			);
		}
	},
};
