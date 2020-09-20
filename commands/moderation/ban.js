const Moderation = require("../../handlers/Moderation");
const Emotes = require("../../emotes.json");
const SendLog = require("../../handlers/SendLog");

module.exports = {
	name: "ban",
	aliases: ["terminate", "🍰"],
	category: "moderation",
	description: "Bans a user from the guild",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Missing permission ``ADMINISTRATOR``"); // I know best has permssion lol
		if (args[0] === undefined || args[0] === null) return message.channel.send("🤣  lmao mate you forgot something");
		let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
		let user = message.guild.member(target);
		let reason = args.slice(1).join(" ");
		if (reason === "") reason = "No reason given";
		if (user === null) {
			user = await client.users.fetch(target);
			if (!user) return await message.channel.send("Unable to find user.");
			if (!(await Moderation.ForceBan(client, message.guild.id, target, message.author, reason))) return message.channel.send(`Unable to ban <@${target}> \`\`(${target})\`\`.`);
		} else {
			if (!(await Moderation.Ban(client, message.guild.id, target, message.author, reason))) return message.channel.send(`Unable to ban <@${target}> \`\`(${target})\`\`.`);
			user = user.user;
		}

		await SendLog.Mod_action(client, message.guild.id, `${Emotes.actions.ban} Banned **${user.username}**#${user.discriminator} \`\`(${user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `, "");

		message.channel.send(`${Emotes.actions.ban} Banning <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``);
	},
};
