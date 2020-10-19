const request = require("request");
const Discord = require("discord.js");

module.exports = {
	name: "reverseinvite",
	category: "developer",
	description: "Currently in development",
	run: async (_client, message, args) => {
		let developers = process.env.DEVELOPERS.split(",");
		if (args[0] === undefined)
			return message.channel.send("Missing required argument");
		let url = args[0];
		if (!url.startsWith("http") && !url.startsWith("https"))
			url = `http://${url}`;
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
					if (response === undefined) return;
					r.push(`\n🌐 **${response.request.href}**`);
					embed.setDescription(r);
					return message.channel.send(embed);
				}
			);
		}
	},
};
