const fs = require("fs");
const moment = require("moment");
const SendLog = require("../../handlers/SendLog");

module.exports = {
	name: "purge",
	aliases: ["clear"],
	category: "moderation",
	description: "Purge X amount of message in channel",
	run: async (client, message, args) => {
		if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(":lock: Missing permission ``ADMINISTRATOR``"); // I know best has permssion lol
		let amount = 0;

		if (!args[0]) return message.channel.send("🤣  lmao mate you forgot something");
		else amount = Number(args[0]);
		if (amount > 100) return message.channel.send("Can only purge a max of 100 messages each time");

		let deletedMSG = "";
		deletedMSG += `Purge in ${message.channel.name} (${message.channel.id}) by ${message.author.username}#${message.author.discriminator} (${message.author.id}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")} \n`;

		message.channel.messages
			.fetch({
				limit: amount.toString(),
			})
			.then(async (messages) => {
				messages.map((i) => (deletedMSG += `${i.author.username}#${i.author.discriminator} (${i.author.id}) | ${i.content}\n`));
				message.channel.bulkDelete(messages);
				fs.writeFile(`./files/purge/${message.guild.id}.txt`, deletedMSG, function (err) {
					if (err) return console.error(`[Purge] ${err}`);
				});

				await SendLog.Mod_action(client, message.guild.id, `Purged \`\`${amount}\`\` messages in ${message.channel} \`\`(${message.channel.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\``, `./files/purge/${message.guild.id}.txt`);
			});

		await message.channel
			.send(`Successfully purged \`\`${amount}\`\` messages in **${message.channel.name}**`)
			.then((msg) => {
				msg.delete({ timeout: 1500 });
			})
			.catch((err) => {
				console.error(`[Purge] ${err}`);
			});
		fs.unlinkSync(`./files/purge/${message.guild.id}.txt`); // Removes the file from the system
	},
};
