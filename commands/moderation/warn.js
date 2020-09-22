const Moderation = require("../../handlers/Moderation");
const Emotes = require("../../emotes.json");
const SendLog = require("../../handlers/SendLog");

module.exports = {
	name: "warn",
	category: "moderation",
	description: "Warns a user inside of guild",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Missing permission ``ADMINISTRATOR``"); // I know best has permssion lol
		if (args[0] === undefined || args[0] === null) return message.channel.send(`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`warn <user> [reason]\`\``);
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);
		let reason = args.slice(1).join(" ");
		if (reason === "") reason = "No reason given";
		if (user === null) return message.channel.send("User is not in server");

		if (!(await Moderation.Warn(client, message.guild.id, target, message.author, reason))) return message.channel.send(`Unable to warn <@${target}> \`\`(${target})\`\`.`);
		await SendLog.Mod_action(
			client,
			message.guild.id,
			`${Emotes.actions.warn} Warning given to **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `,
			""
		);

		message.channel.send(`${Emotes.actions.warn} Warned <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``);
	},
};
