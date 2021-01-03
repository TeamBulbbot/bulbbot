const Discord = require("discord.js");

module.exports = (client, msg) => {
	const embed = new Discord.MessageEmbed()
		.setColor(global.config.embedColor)
		.setAuthor(`${msg.author.tag} (${msg.author.id})`, msg.author.avatarURL({ dynamic: true }))
		.setDescription(msg.content)
		.setFooter(`Message ID: ${msg.id}`)
		.setImage(msg.attachments.first() !== undefined ? msg.attachments.first().proxyURL : "")
		.setTimestamp();

	client.channels.cache.get(global.config.botDM).send(embed);
};
