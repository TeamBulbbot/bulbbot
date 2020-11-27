const Discord = require("discord.js");

module.exports = {
	name: "about",
	aliases: ["bot", "license", "privacypolicy", "support", "invite", "github"],
	category: "botinfo",
	description: "Get some basic information about the bot",
	usage: "about",
	clientPermissions: ["EMBED_LINKS", "SEND_MESSAGES", "VIEW_CHANNEL"],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (client, message, _args) => {
		let desc = "";
		const developers = process.env.DEVELOPERS.split(",");

		for (let i = 0; i < developers.length; i++) {
			const dev = await client.users.fetch(developers[i]);
			desc += `**${dev.username}**#${dev.discriminator} \`\`(${dev.id})\`\`\n`;
		}

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTimestamp()
			.setThumbnail(client.user.avatarURL())
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			)
			.setAuthor(
				`About ${client.user.username}#${client.user.discriminator}`,
				client.user.avatarURL()
			)
			.setDescription(
				`
**Support server**
**https://discord.gg/cacUmbQ**

**🛠️ Developers**
${desc}
**📜 License**
This bot is licensed under the MIT license, for more info please see the full license **[here](https://github.com/TestersQTs/Bulbbot/blob/master/LICENSE)**
        `
			)
			.addField(
				"Github",
				"**[Link](https://github.com/TestersQTs/Bulbbot)**",
				true
			)
			.addField(
				"Invite bot",
				"**[Link](https://discord.com/oauth2/authorize?client_id=755149065137815623&scope=bot&permissions=1544940655)**",
				true
			)
			.addField(
				"Privacy Policy",
				"**[Link](https://www.notion.so/Bulbbot-Privacy-Policy-23188b59422e4f089a0379ae34715cd7#c43815d9fb56427380c7c639fb77b3ea)**",
				true
			);

		return message.channel.send(embed);
	},
};
