const Command = require("../../structures/Command");
const { SendModActionFile } = require("../../utils/moderation/log");
const fs = require("fs");
const moment = require("moment");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Purges messages from a chat",
			category: "Moderation",
			aliases: ["clear"],
			usage: "!purge <amount>",
			examples: ["purge 30"],
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
		if (amount > 200) return message.channel.send(await this.client.bulbutils.translate("purge_too_many"));
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

		for (let i = 0; i < deleteMsg.length; i++) {
			const msgs = await message.channel.messages.fetch({
				limit: deleteMsg[i],
			});

			msgs.map(m => {
				delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content}\n`;
			});

			await message.channel.bulkDelete(msgs);
		}

		fs.writeFile(`./src/files/purge/${message.guild.id}.txt`, delMsgs, function (err) {
			if (err) console.error(err);
		});

		await SendModActionFile(
			this.client,
			message.guild,
			"Purge",
			amount,
			`./src/files/purge/${message.guild.id}.txt`,
			message.channel,
			message.author,
		);

		// TODO
		// - send message back to user

		fs.unlinkSync(`./src/files/purge/${message.guild.id}.txt`);
	}
};
