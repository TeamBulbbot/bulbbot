const Emotes = require("../../emotes.json");
const Remind = require("../../models/remind");
const moment = require("moment");
const Discord = require("discord.js");
const clc = require("cli-color");
const mongoose = require("mongoose");
const Validate = require("../../handlers/validate");

module.exports = {
	name: "remind",
	aliases: ["reminder", "r", "🕰️"],
	category: "miscellaneous",
	description: "Reminds you something",
	usage: "remind <duration> <reminder>",
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`remind|reminder|r|🕰️ <duration> <reminder> \`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`reminder\`\`\n${Emotes.other.tools} Correct usage of command: \`\`remind|reminder|r|🕰️ <duration> <reminder> \`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);

		const duration = args[0];
		let unixDuration = duration;

		switch (duration.substr(duration.length - 1)) {
			case "w":
				unixDuration = unixDuration.substring(0, unixDuration.length - 1);
				if (unixDuration > 52)
					return message.channel.send(
						`${Emotes.actions.warn} You cannot have a reminder for more than year`
					);
				unixDuration = moment().add(unixDuration, "weeks").unix();
				break;
			case "d":
				unixDuration = unixDuration.substring(0, unixDuration.length - 1);
				if (unixDuration > 365)
					return message.channel.send(
						`${Emotes.actions.warn} You cannot have a reminder for more than year`
					);
				unixDuration = moment().add(unixDuration, "days").unix();
				break;
			case "h":
				unixDuration = unixDuration.substring(0, unixDuration.length - 1);
				if (unixDuration > 8765)
					return message.channel.send(
						`${Emotes.actions.warn} You cannot have a reminder for more than year`
					);
				unixDuration = moment().add(unixDuration, "hours").unix();
				break;
			case "m":
				unixDuration = unixDuration.substring(0, unixDuration.length - 1);
				if (unixDuration > 525948)
					return message.channel.send(
						`${Emotes.actions.warn} You cannot have a reminder for more than year`
					);
				unixDuration = moment().add(unixDuration, "minutes").unix();
				break;
			case "s":
				unixDuration = unixDuration.substring(0, unixDuration.length - 1);
				if (unixDuration > 31556926)
					return message.channel.send(
						`${Emotes.actions.warn} You cannot have a reminder for more than year`
					);
				unixDuration = moment().add(unixDuration, "seconds").unix();
				break;

			default:
				return message.channel.send(
					`${Emotes.actions.warn} Invalid \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`remind|reminder|r|🕰️ <duration> <reminder> \`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
				);
		}

		const embed = new Discord.MessageEmbed()
			.setColor(process.env.COLOR)
			.setTimestamp()
			.setFooter(
				`Executed by ${message.author.username}#${message.author.discriminator}`,
				message.author.avatarURL()
			)
			.setTitle("Where do you want to get reminded?")
			.setDescription(
				`
${Emotes.other.plus} **Here**
${Emotes.other.minus} **In dms**
${Emotes.actions.cancel} **Cancel**

                `
			);

		message.channel.send(embed).then(async (msg) => {
			await msg
				.react(Emotes.other.plus.replace(/\D/g, ""))
				.then(() => msg.react(Emotes.other.minus.replace(/\D/g, "")))
				.then(() => msg.react(Emotes.actions.cancel.replace(/\D/g, "")));

			const filter = (reaction, user) => {
				return (
					[
						Emotes.other.plus.replace(/\D/g, ""),
						Emotes.other.minus.replace(/\D/g, ""),
						Emotes.actions.cancel.replace(/\D/g, ""),
					].includes(reaction.emoji.id) && user.id === message.author.id
				);
			};

			msg
				.awaitReactions(filter, {
					max: 1,
					time: 30000,
					errors: ["time"],
				})
				.then(async (collected) => {
					const reaction = collected.first();
					if (reaction.emoji.id === Emotes.actions.cancel.replace(/\D/g, ""))
						return message.channel.send(
							`${Emotes.actions.cancel} Canceling the operation.`
						);
					else if (reaction.emoji.id === Emotes.other.plus.replace(/\D/g, "")) {
						let msg = await Validate.Master(client, args.slice(1).join(" "));
						// in that channel
						const remind = new Remind({
							_id: mongoose.Types.ObjectId(),
							userID: message.author.id,
							dmRemind: false,
							channelID: message.channel.id,
							reminder: msg,
							expireTime: unixDuration,
						});
						remind.save().catch((err) => console.error(clc.red(err)));

						return message.channel.send(
							`${Emotes.actions.confirm} Reminding you in **${duration}** here.`
						);
					} else if (
						reaction.emoji.id === Emotes.other.minus.replace(/\D/g, "")
					) {
						// In dms
						const remind = new Remind({
							_id: mongoose.Types.ObjectId(),
							userID: message.author.id,
							dmRemind: true,
							channelID: "",
							guildID: "",
							reminder: args.slice(1).join(" "),
							expireTime: unixDuration,
						});
						remind.save().catch((err) => console.error(clc.red(err)));

						return message.channel.send(
							`${Emotes.actions.confirm} Reminding you in **${duration}** in dms.`
						);
					} else
						return message.channel.send(
							`${Emotes.actions.cancel} Canceling the operation.`
						);
				})
				.catch((_) => {
					message.channel.send(
						`${Emotes.actions.cancel} Canceling the operation.`
					);
				});
		});
	},
};
