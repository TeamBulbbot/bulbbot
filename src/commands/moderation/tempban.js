const parse = require("parse-duration");

const Log = require("../../utils/moderation/log");
const Moderation = require("../../utils/moderation/moderation");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "tempban",
	aliases: ["tempyeet"],
	category: "moderation",
	description: "Bans a user from the guild",
	usage: "tempban <user> <duration> [reason]",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"BAN_MEMBERS",
		"USE_EXTERNAL_EMOJIS",
	],
	userPermissions: ["BAN_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`tempban <user> <duration> [reason]\`\``
			);
		if (args[1] === undefined || args[1] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`duration\`\`\n${Emotes.other.tools} Correct usage of command: \`\`tempban <user> <duration> [reason]\`\``
			);

		let target = args[0].replace(/\D/g, "");
		let duration = parse(args[1]);
		let reason = args.slice(2).join(" ");
		if (reason === "") reason = "No reason given";

		let user = message.guild.member(target);

		if (user == null) {
			return message.channel.send("User is not in server");
		}

		if (duration < parse("1s")) {
			return message.channel.send(
				`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be shorter than 1 second \n${Emotes.other.tools} Correct usage of command: \`\`tempban|tempyeet <user> <duration> [reason]\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);
		} else if (duration > parse("1y")) {
			return message.channel.send(
				`${Emotes.actions.warn} Invalid \`\`duration\`\`, the time can also not be longer than 1 year \n${Emotes.other.tools} Correct usage of command: \`\`tempban|tempyeet <user> <duration> [reason]\`\`\n**Duration:** \`\`w = week\`\`, \`\`d = day\`\`, \`\`h = hour\`\`, \`\`m = minutes\`\`, \`\`s = seconds\`\``
			);
		}

		if (
			!(await Moderation.Tempban(
				client,
				message.guild.id,
				target,
				message.author,
				reason,
				args[1],
				Math.floor(new Date().getTime() / 1000) + duration / 1000
			))
		)
			return message.channel.send(
				`Unable to ban <@${target}> \`\`(${target})\`\`.`
			);

		await Log.Mod_action(
			client,
			message.guild.id,
			`${Emotes.actions.ban} **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` has been temporarily banned by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\`  \n**Reason:** ${reason} \n**Duration:** ${args[1]}`,
			""
		);
		message.channel.send(
			`${Emotes.actions.ban} **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` has been temporarily banned because \`\`${reason}\`\` and for \`\`${args[1]}\`\``
		);
	},
};
