const Emotes = require("../../emotes.json");
const SendLog = require("../../handlers/SendLog");

module.exports = {
	name: "unban",
	aliases: ["pardon"],
	category: "moderation",
	description: "Unban a user from the server",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Missing permission ``ADMINISTRATOR``"); // I know best has permssion lol
		if (args[0] === undefined || args[0] === null) return message.channel.send(`${Emotes.actions.warn} Missing required argument \`\`user\`\`\n${Emotes.other.tools} Correct usage of command: \`\`unban|pardon <user> [reason]\`\``);
		let target = args[0];
		let reason = args.slice(1).join(" ");
		if (reason === "") reason = "No reason given";

		let whoToUnban = "";

		message.guild.fetchBans().then(async (bans) => {
			bans.forEach((ban) => {
				// Check for id
				if (ban.user.id === target) whoToUnban = ban.user.id;

				// Check for username
				if (ban.user.username.toLowerCase().includes(target.toLowerCase())) whoToUnban = ban.user.id;
			});

			if (whoToUnban === "") return message.channel.send(`\`\`${target}\`\` is not banned in ${message.guild.name}`);

			const user = await client.users.fetch(whoToUnban);

			message.channel.send(`Are you sure you want to unban **${user.username}**#${user.discriminator} \`\`(${user.id})\`\`?`).then((msg) => {
				msg
					.react(Emotes.actions.confirm.replace(/\D/g, "")) // Confrim
					.then(() => msg.react(Emotes.actions.cancel.replace(/\D/g, ""))); // Cancel

				const filter = (reaction, user) => {
					return [Emotes.actions.confirm.replace(/\D/g, ""), Emotes.actions.cancel.replace(/\D/g, "")].includes(reaction.emoji.id) && user.id === message.author.id;
				};

				msg.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] }).then(async (collected) => {
					const reaction = collected.first();

					if (reaction.emoji.id === Emotes.actions.confirm.replace(/\D/g, "")) {
						message.guild.members.unban(whoToUnban, `Moderator: ${message.author.username}#${message.author.discriminator} (${message.author.id}) | Target: ${whoToUnban} | Reason: ${reason}`);

						await SendLog.Mod_action(client, message.guild.id, `Unbanned **${user.username}**#${user.discriminator} \`\`(${user.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\` \n**Reason:** ${reason} `, "");

						return message.channel.send(`Unbanning <@${whoToUnban}> \`\`(${whoToUnban})\`\` for \`\`${reason}\`\``);
					} else {
						return message.channel.send(`${Emotes.actions.cancel} Canceling the operation.`);
					}
				});
			});
		});
	},
};
