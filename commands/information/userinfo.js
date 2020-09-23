const Discord = require("discord.js");
const Helper = require("../../handlers/Helper");
const moment = require("moment");

module.exports = {
	name: "userinfo",
	aliases: ["info", "whois"],
	category: "information",
	description: "Gets some useful information about a user/bot",
	run: async (client, message, args) => {
		let target;
		if (args[0] == undefined || args[0] == null) target = message.author.id;
		// If args[0] is not selected use the author as target
		else target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);

		let descriptionBottom = "";
		let description = "";

		const end = moment.utc().format("YYYY-MM-DD");
		let start = "";

		if (user === null) {
			// If user is not from guild
			try {
				user = await client.users.fetch(target);
			} catch (error) {
				return message.channel.send("User was not found");
			}
		} else {
			// User is from guild
			user.nickname !== null ? (descriptionBottom += `**Nickname: ** ${user.nickname}\n`) : "";

			start = moment(moment.utc(user.joinedTimestamp).format("YYYY-MM-DD"));
			const daysInServer = moment.duration(start.diff(end)).asDays();

			descriptionBottom += `**Joined server:** ${moment.utc(user.joinedTimestamp).format("dddd, MMMM, Do YYYY")} \`\`(${daysInServer.toString().replace("-", "")} days ago)\`\`\n`;
			descriptionBottom += `**Roles: ** ${user._roles.map((i) => `<@&${i}>`).join(" ")}\n`;

			user = user.user;
		}

		description += `${await Helper.Badges(user.flags.bitfield)}\n`;
		description += `**ID: ** ${user.id}\n`;
		description += `**Username:** **${user.username}**#${user.discriminator}\n`;
		description += `**Profile: ** <@${user.id}>\n`;
		description += `**Avatar URL:** [Link](${user.avatarURL()})\n`;
		description += `**Bot: ** ${user.bot}\n`;

		start = moment(moment(user.createdAt).format("YYYY-MM-DD"));
		const daysOnDiscord = moment.duration(start.diff(end)).asDays();
		description += `**Account creation:** ${moment(user.createdAt).format("dddd, MMMM, Do YYYY")} \`\`(${Math.floor(daysOnDiscord).toString().replace("-", "")} days ago)\`\``;

		let embed = new Discord.MessageEmbed().setColor(process.env.COLOR).setTimestamp().setFooter(`Executed by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL()).setThumbnail(user.avatarURL()).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
			.setDescription(`
${description}
${descriptionBottom}

		`);
		return message.channel.send(embed);
	},
};
