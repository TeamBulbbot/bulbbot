const Moderation = require("../../handlers/Moderation");
const Emotes = require("../../emotes.json");
const SendLog = require("../../handlers/SendLog");
const Role = require("../../models/role");

module.exports = {
	name: "kick",
	category: "moderation",
	description: "Kicks a user from the guild",
	run: async (client, message, args) => {
		Role.findOne(
			{
				guildID: message.guild.id,
			},
			async (err, roles) => {
				if (message.member.roles.cache.has(roles.moderator) || message.member.hasPermission("KICK_MEMBERS")) {
					if (args[0] === undefined || args[0] === null) return message.channel.send(`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`kick <user> [reason]\`\``);
					let target = args[0].replace(/\D/g, ""); // Remove everything except numbers
					let user = message.guild.member(target);
					let reason = args.slice(1).join(" ");
					if (reason === "") reason = "No reason given";
					if (user === null) return message.channel.send("User is not in server");

					if (!(await Moderation.Kick(client, message.guild.id, target, message.author, reason))) return message.channel.send(`Unable to kick <@${target}> \`\`(${target})\`\`.`);
					await SendLog.Mod_action(client, message.guild.id, `${Emotes.actions.kick} Kicked **${user.user.username}**#${user.user.discriminator} \`\`(${user.user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `, "");

					message.channel.send(`${Emotes.actions.kick} Kicking <@${target}> \`\`(${target})\`\` for \`\`${reason}\`\``);
				} else return message.channel.send(":lock: Missing permission");
			}
		);
	},
};
