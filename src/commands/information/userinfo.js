const Discord = require("discord.js");
const moment = require("moment");

const Beautify = require("../../utils/helper/beautify");
const Translator = require("../../utils/lang/translator");

module.exports = {
	name: "userinfo",
	aliases: ["info", "whois"],
	category: "information",
	description: "Gets some useful information about a user/bot",
	usage: "userinfo <user>",
	clientPermissions: [
		"EMBED_LINKS",
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: [],
	clearanceLevel: 0,
	run: async (client, message, args) => {
		let target;
		if (args[0] == undefined) target = message.author.id;
		// If args[0] is not selected use the author as target
		else target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);

		let descriptionBottom = "";
		let description = "";
		let addedCreation = false;

		if (user === null) {
			// If user is not from guild
			try {
				user = await client.users.fetch(target);
			} catch (error) {
				return message.channel.send(
					Translator.Translate("global_user_not_found", { user: args[0] })
				);
			}
		} else {
			user.nickname !== null
				? (descriptionBottom += `**Nickname: ** ${user.nickname}\n`)
				: "";

			if (user.premiumSinceTimestamp !== 0) {
				descriptionBottom += GetDays(
					"**Boosting since:**",
					user.premiumSinceTimestamp
				);
			}

			descriptionBottom += GetDays("**Joined Guild:**", user.joinedTimestamp);
			descriptionBottom += GetDays(
				"**Account Creation:**",
				user.user.createdAt
			);

			addedCreation = true;
			user = user.user;
		}

		if (!addedCreation)
			descriptionBottom += GetDays("**Account Creation:**", user.createdAt);

		user.nickname !== null
			? (description += `${Beautify.Badges(user.flags.bitfield)}\n`)
			: "";
		description += `**ID: ** ${user.id}\n`;
		description += `**Username:** **${user.username}**#${user.discriminator}\n`;
		description += `**Profile: ** <@${user.id}>\n`;
		description += `**Avatar URL:** [Link](${user.avatarURL({
			dynamic: true,
		})})\n`;
		description += `**Bot: ** ${user.bot}\n`;

		let embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTimestamp()
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			)
			.setThumbnail(user.avatarURL({ dynamic: true }))
			.setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
			.setDescription(`${description}${descriptionBottom}`);
		return message.channel.send(embed);
	},
};

function GetDays(text, start) {
	const end = moment.utc().format("YYYY-MM-DD");
	const date = moment(moment.utc(start).format("YYYY-MM-DD"));
	const days = moment.duration(date.diff(end)).asDays();

	return `${text} ${moment
		.utc(start)
		.format("dddd, MMMM, Do YYYY")} \`\`(${Math.floor(days)
		.toString()
		.replace("-", "")} days ago)\`\`\n`;
}
