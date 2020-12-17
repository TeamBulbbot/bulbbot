const Command = require("../../structures/Command");
const fs = require("fs");
const moment = require("moment");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Purges messages from a chat",
			category: "Moderation",
			aliases: ["clear"],
			usage: "!purge <amount>",
			argList: ["amount:integer"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_MESSAGES"],
			clientPerms: ["MANAGE_MESSAGES"],
		});
	}

	async run(message, args) {
		const amount = args[0];
		if (amount > 500) return message.channel.send(this.client.bulbutils.translate("purge_too_many"));
		let deleteMsg = [];
		let a = 0;

		for (let i = 1; i <= amount; i++) {
			if (i % 100 === 0) {
				deleteMsg.push(100);
				a = i;
			}
		}
		if (amount - a !== 0) deleteMsg.push(amount - a);

		fs.writeFile(
			`./src/files/purge/${message.guild.id}.txt`,
			`Message purge in #${message.channel.name} (${message.channel.id}) by ${message.author.tag} (${message.author.id}) at ${moment().format(
				"MMMM Do YYYY, h:mm:ss a",
			)} \n`,
			function (err) {
				if (err) console.error(err);
			},
		);

		var delMsgs = "";

		deleteMsg.forEach(async count => {
			await message.channel.messages
				.fetch({
					limit: count,
				})
				.then(async msgs => {
					await msgs.map(
						m =>
							(delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${
								m.content
							}\n`),
					);

					fs.appendFile(`./src/files/purge/${message.guild.id}.txt`, delMsgs, function (err) {
						if (err) console.error(err);
					});

					await message.channel.bulkDelete(msgs);
				});
		});
	}
};
