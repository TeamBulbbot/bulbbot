const Discord = require("discord.js");

module.exports = {
	name: "about",
	aliases: ["bot", "license", "privacypolicy", "support", "invite", "github"],
	category: "botinfo",
	description: "Get some basic information about the bot",
	run: async (client, message, args) => {
		let embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTimestamp()
			.setFooter(`Executed by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL())
			.setAuthor(`About ${client.user.username}#${client.user.discriminator}`, client.user.avatarURL())
			.setDescription(
				`
**Support server**
**https://discord.gg/cacUmbQ**

**🛠️ Developers**
**Ben!**#0002 \`\`(255834596766253057)\`\`
**KlukCZ**#6589 \`\`(439396770695479297)\`\`
**mrphilip**#0882 \`\`(190160914765316096)\`\`

**📜 License**
This bot is licensed under the MIT license, for more info please see the full license **[here](https://github.com/TestersQTs/Bulbbot/blob/master/LICENSE)**
        `
			)
			.addField("Github", "**[Link](https://github.com/TestersQTs/Bulbbot)**", true)
			.addField("Invite bot", "**Invite link goes here**", true)
			.addField("Privacy Policy", "**[Link](https://github.com/TestersQTs/Bulbbot/blob/master//Privacy%20Policy.md)**", true);

		return message.channel.send(embed);
	},
};
