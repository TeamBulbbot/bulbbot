const fs = require("fs");
const moment = require("moment");

const Log = require("../../utils/moderation/log");
const Logger = require("../../utils/other/winston");
const Emotes = require("../../emotes.json");

module.exports = {
	name: "purge",
	aliases: ["clear"],
	category: "moderation",
	description: "Purge X amount of message in channel",
	usage: "purge <amount>",
	clientPermissions: [
		"SEND_MESSAGES",
		"VIEW_CHANNEL",
		"MANAGE_MESSAGES",
		"USE_EXTERNAL_EMOJIS",
		"ATTACH_FILES",
	],
	userPermissions: ["MANAGE_MESSAGES", "MANAGE_GUILD"],
	clearanceLevel: 50,
	run: async (client, message, args) => {
		let amount = 0;

		if (!args[0])
			return message.channel.send(
				`${Emotes.actions.warn} Missing required argument \`\`amount\`\`\n${Emotes.other.tools} Correct usage of command: \`\`purge|clear <amount>\`\``
			);
		else amount = Number(args[0]);
		if (amount > 100)
			return message.channel.send(
				"Can only purge a max of 100 messages each time"
			);

		let deletedMSG = "";
		deletedMSG += `Purge in ${message.channel.name} (${
			message.channel.id
		}) by ${message.author.username}#${message.author.discriminator} (${
			message.author.id
		}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")} \n`;

		message.channel.messages
			.fetch({
				limit: amount.toString(),
			})
			.then(async (messages) => {
				messages.map(
					(i) =>
						(deletedMSG += `${i.author.username}#${i.author.discriminator} (${i.author.id}) | ${i.content}\n`)
				);
				message.channel.bulkDelete(messages);
				fs.writeFile(
					`./src/files/purge/${message.guild.id}.txt`,
					deletedMSG,
					function (err) {
						if (err) Logger.error(err);
					}
				);

				await Log.Mod_action(
					client,
					message.guild.id,
					`Purged \`\`${amount}\`\` messages in ${message.channel} \`\`(${message.channel.id})\`\` by **${message.author.username}**#${message.author.discriminator} \`\`(${message.author.id})\`\``,
					`./src/files/purge/${message.guild.id}.txt`
				);
			});

		await message.channel
			.send(
				`Successfully purged \`\`${amount}\`\` messages in **${message.channel.name}**`
			)
			.then((msg) => {
				msg.delete({ timeout: 1500 });
			})
			.catch((err) => {
				Logger.error(err);
			});
		fs.unlinkSync(`./src/files/purge/${message.guild.id}.txt`); // Removes the file from the system
	},
};
