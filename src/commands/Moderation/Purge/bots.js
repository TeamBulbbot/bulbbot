const { SendModActionFile } = require("../../../utils/moderation/log");
const fs = require("fs");
const moment = require("moment");

module.exports = {
	Call: async (client, message, args) => {
		let amount = args[1];
		if (!args[1])
			return message.channel.send(
				await client.bulbutils.translate("event_message_args_missing", message.guild.id, {
					arg: "amount:int",
					arg_expected: 2,
					arg_provided: 1,
					usage: "!purge bots <count>",
				}),
			);
		if (amount > 100) return message.channel.send(await client.bulbutils.translate("purge_too_many", message.guild.id));
		if (amount <= 1 || isNaN(amount)) return message.channel.send(await client.bulbutils.translate("purge_too_few", message.guild.id));

		let deleteMsg = [];
		let a = 0;

		for (let i = 1; i <= amount; i++) {
			if (i % 100 === 0) {
				deleteMsg.push(100);
				a = i;
			}
		}
		if (amount - a !== 0) deleteMsg.push(amount - a);

		let delMsgs = `Message purge in #${message.channel.name} (${message.channel.id}) by ${message.author.tag} (${
			message.author.id
		}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")} \n`;

		let messagesToPurge = [];
		amount = 0;

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs = await message.channel.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(async m => {
				if (m.author.bot) {
					delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content} |\n`;
					messagesToPurge.push(m.id);
					amount++;
				}
			});
		}

		await message.channel.bulkDelete(messagesToPurge);

		fs.writeFile(`./src/files/purge/${message.guild.id}.txt`, delMsgs, function (err) {
			if (err) console.error(err);
		});

		await SendModActionFile(client, message.guild, "Purge", amount, `./src/files/purge/${message.guild.id}.txt`, message.channel, message.author);

		message.channel.send(await client.bulbutils.translate("purge_success", message.guild.id, { count: amount }));
	},
};
