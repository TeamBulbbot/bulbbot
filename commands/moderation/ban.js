const Moderation = require("../../handlers/Moderation");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "ban",
	aliases: ["terminate", "🍰"],
	category: "moderation",
	description: "Bans a user from the guild",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("MANAGE_SERVER")) return message.channel.send(":lock: Missing permission ``MANAGE_SERVER``"); // I know best has permssion lol
		if (args[0] === undefined || args[0] === null) return message.channel.send("🤣  lmao mate you forgot something");
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let reason = args.slice(1).join(" ");
		if (reason === "") reason = "No reason given";
		if (!(await Moderation.Ban(client, message.guild.id, target, message.author, reason))) return message.channel.send(`Unable to ban <@${target}> \`\`(${target})\`\`.`);

		message.channel.send(`${Emotes.actions.ban} Banning <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``);
	},
};
