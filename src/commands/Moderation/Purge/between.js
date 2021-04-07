const { SendModActionFile } = require("../../../utils/moderation/log");
const fs = require("fs");
const moment = require("moment");

module.exports = {
	Call: async (client, message, args) => {
		const msgs = await message.channel.messages.fetch({ limit: 100 });
		const allMessages = msgs.map(m => m).reverse();
		const messages = [];
		let delMsgs = `Message purge in #${message.channel.name} (${message.channel.id}) by ${message.author.tag} (${
			message.author.id
		}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")} \n`;

		let counting = false;
		for (let msg of allMessages) {
			if (msg.id === args[1]) {
				counting = true;
			}

			if (counting) {
				messages.push(msg.id);
				delMsgs += `${moment(msg.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${msg.author.tag} (${msg.author.id}) | ${msg.id} | ${
					msg.content
				} |\n`;
			}

			if (msg.id === args[2]) counting = false;
		}

		await message.channel.bulkDelete(messages);

		fs.writeFile(`./src/files/purge/${message.guild.id}.txt`, delMsgs, function (err) {
			if (err) console.error(err);
		});

		await SendModActionFile(
			client,
			message.guild,
			"Purge",
			messages.length,
			`./src/files/purge/${message.guild.id}.txt`,
			message.channel,
			message.author,
		);

		message.channel.send(await client.bulbutils.translate("purge_success", message.guild.id, { count: messages.length }));
	},
};
