const Moderation = require("../../utils/moderation/moderation");
const Emotes = require("../../emotes.json");
const Log = require("../../utils/moderation/log");

module.exports = {
	name: "multikick",
	aliases: ["mkick"],
	category: "moderation",
	description: "Kicks a couple of users inside of guild",
	usage: "multikick <user> [user2]...[reason]",
	clientPermissions: ["SEND_MESSAGES", "VIEW_CHANNEL", "USE_EXTERNAL_EMOJIS"],
	userPermissions: ["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		if (args[0] === undefined || args[0] === null)
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`users\`\`\n${Emotes.other.tools} Correct usage of command: \`\`multikick <user> [user2]...[reason]\`\``
			);

		let targets = args
			.slice(0)
			.join(" ")
			.match(/<@?!?[0-9>]+|[0-9>]{17,}/g);
		let reason = args
			.slice(0)
			.join("")
			.replace(/<@?!?[0-9>]+|[0-9>]{17,}/g, "");
		if (reason === "") reason = "No reason given";
		let fullList = "";

		for (let i = 0; i < targets.length; i++) {
			target = targets[i].replace(/\D/g, "");
			let t = await client.users.fetch(target);

			await Moderation.Kick(
				client,
				message.guild.id,
				target,
				message.author,
				reason
			);
			fullList += `**${t.username}**#${t.discriminator} \`\`(${t.id})\`\`, `;
		}

		await Log.Mod_action(
			client,
			message.guild.id,
			`${Emotes.actions.kick} Multiple targets were kicked ${fullList} by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
			""
		);
		message.channel.send(
			`${Emotes.actions.kick} Kicked ${fullList} for \`\`${reason}\`\``
		);
	},
};
