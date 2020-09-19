const Discord = require("discord.js");
const Helper = require("../../handlers/Helper");
const moment = require("moment");
const Emotes = require("../../emotes.json");
const Moderation = require("../../handlers/Moderation");

module.exports = {
	name: "usermanagement",
	aliases: ["usermgmt", "um"],
	category: "moderation",
	description: "Moderation command on user",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Missing permission ``ADMINISTRATOR``"); // I know best has permssion lol
		if (args[0] === undefined || args[0] === null) return message.channel.send("🤣  lmao mate you forgot something");
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);

		let descriptionBottom = "";
		let description = "";

		const end = moment.utc().format("YYYY-MM-DD");
		let start = "";

		if (user !== null) {
			user.nickname !== null ? (descriptionBottom += `**Nickname: ** ${user.nickname}\n`) : "";

			start = moment(moment.utc(user.joinedTimestamp).format("YYYY-MM-DD"));
			const daysInServer = moment.duration(start.diff(end)).asDays();

			descriptionBottom += `**Joined server:** ${moment.utc(user.joinedTimestamp).format("dddd, MMMM, Do YYYY")} \`\`(${daysInServer.toString().replace("-", "")} days ago)\`\`\n`;
			descriptionBottom += `**Roles: ** ${user._roles.map((i) => `<@&${i}>`).join(" ")}\n`;

			user = user.user;
		} else return message.channel.send("User is not in server");

		description += `${await Helper.Badges(user.flags.bitfield)}\n`;
		description += `**ID: ** ${user.id}\n`;
		description += `**Username: **${user.username}#${user.discriminator}\n`;
		description += `**Profile: ** <@${user.id}>\n`;
		description += `**Avatar URL:** [Link](${user.avatarURL()})\n`;
		description += `**Bot: ** ${user.bot}\n`;

		start = moment(moment(user.createdAt).format("YYYY-MM-DD"));
		const daysOnDiscord = moment.duration(start.diff(end)).asDays();
		description += `**Account creation:** ${moment(user.createdAt).format("dddd, MMMM, Do YYYY")} \`\`(${Math.floor(daysOnDiscord).toString().replace("-", "")} days ago)\`\``;

		descriptionBottom += `**Infractions: ** ${Math.floor(Math.random() * 100001)}`; // Please someone add a way to track infractions

		let embed = new Discord.MessageEmbed().setColor(process.env.COLOR).setTimestamp().setFooter(`Executed by ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL()).setThumbnail(user.avatarURL()).setAuthor(`${user.username}#${user.discriminator}`, user.avatarURL())
			.setDescription(`
${description}
${descriptionBottom}

		`);
		message.channel.send(embed).then((msg) => {
			msg
				.react(Emotes.actions.warn.replace(/\D/g, "")) // Warn
				.then(() => msg.react(Emotes.actions.mute.replace(/\D/g, ""))) // Mute
				.then(() => msg.react(Emotes.actions.kick.replace(/\D/g, ""))) // Kick
				.then(() => msg.react(Emotes.actions.ban.replace(/\D/g, ""))) // Ban
				.then(() => msg.react(Emotes.actions.cancel.replace(/\D/g, ""))); // Cancel

			const filter = (reaction, user) => {
				return [Emotes.actions.warn.replace(/\D/g, ""), Emotes.actions.mute.replace(/\D/g, ""), Emotes.actions.kick.replace(/\D/g, ""), Emotes.actions.ban.replace(/\D/g, ""), Emotes.actions.cancel.replace(/\D/g, "")].includes(reaction.emoji.id) && user.id === message.author.id;
			};

			msg
				.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
				.then(async (collected) => {
					const reaction = collected.first();

					if (reaction.emoji.id === Emotes.actions.warn.replace(/\D/g, "")) {
						Perfom_Action(client, message, Emotes.actions.warn, "Warn", "Warning", target);
					} else if (reaction.emoji.id === Emotes.actions.mute.replace(/\D/g, "")) {
						Perfom_Action(client, message, Emotes.actions.mute, "Mute", "Muting", target);
					} else if (reaction.emoji.id === Emotes.actions.kick.replace(/\D/g, "")) {
						Perfom_Action(client, message, Emotes.actions.kick, "Kick", "Kicking", target);
					} else if (reaction.emoji.id === Emotes.actions.ban.replace(/\D/g, "")) {
						Perfom_Action(client, message, Emotes.actions.ban, "Ban", "Banning", target);
					} else if (reaction.emoji.id === Emotes.actions.cancel.replace(/\D/g, "")) return message.channel.send(`${Emotes.actions.cancel} Canceling the operation.`);
					else return message.channel.send(`${Emotes.actions.cancel} Canceling the operation.`);
				})
				.catch((collected) => {
					message.channel.send(`${Emotes.actions.cancel} Canceling the operation.`);
				});
		});
	},
};

async function Perfom_Action(client, message, emote, action, actionText, target) {
	message.channel.send(`${emote} Reason for the **${action}**?`);
	let reason = "";

	await message.channel
		.awaitMessages((m) => m.author.id == message.author.id, { max: 1, time: 30000 })
		.then(async (collected) => {
			reason = await collected.first().content;
		})
		.catch(() => {
			message.reply("No reason given.");
			reason = "No reason given.";
		});

	switch (action) {
		case "Warn":
			message.channel.send("To be added 🛠️");
			break;
		case "Mute":
			message.channel.send("To be added 🛠️");
			break;
		case "Kick":
			if (!(await Moderation.Kick(client, message.guild.id, target, message.author, reason))) return message.channel.send(`Unable to kick <@${target}> \`\`(${target})\`\`.`);
			break;
		case "Ban":
			if (!(await Moderation.Ban(client, message.guild.id, target, message.author, reason))) return message.channel.send(`Unable to ban <@${target}> \`\`(${target})\`\`.`);
			break;
		default:
			message.channel.send("Something went wrong");
			break;
	}

	message.channel.send(`${actionText} <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``);
}
