const Command = require("../../structures/Command");
const { SendModActionFile } = require("../../utils/moderation/log");
const fs = require("fs");
const moment = require("moment");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Purges messages from a chat",
			category: "Moderation",
			aliases: ["clear", "prune"],
			usage: "!purge <amount>",
			examples: ["purge 30"],
			argList: ["amount:integer"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_MESSAGES"],
			clientPerms: ["MANAGE_MESSAGES", "ATTACH_FILES"],
		});
	}

	async run(message, args) {
		const amount = args[0];
		if (amount > 99) return message.channel.send(await this.client.bulbutils.translate("purge_too_many", message.guild.id));
		if (amount <= 0) return message.channel.send(await this.client.bulbutils.translate("purge_too_few", message.guild.id));

		let delMsgs = `Message purge in #${message.channel.name} (${message.channel.id}) by ${message.author.tag} (${
			message.author.id
		}) at ${moment().format("MMMM Do YYYY, h:mm:ss a")} \n`;

		const msgs = await message.channel.messages.fetch({
			limit: parseInt(amount) + 1,
		});

		msgs.map(m => {
			delMsgs += `${moment(m.createdTimestamp).format("MM/DD/YYYY, h:mm:ss a")} | ${m.author.tag} (${m.author.id}) | ${m.id} | ${m.content}\n`;
		});

		let deletedMessages = 0;
		await message.channel.bulkDelete(msgs, true).then(msg => (deletedMessages = msg.size));

		fs.writeFile(`./src/files/purge/${message.guild.id}.txt`, delMsgs, function (err) {
			if (err) console.error(err);
		});

		await SendModActionFile(
			this.client,
			message.guild,
			"Purge",
			deletedMessages,
			`./src/files/purge/${message.guild.id}.txt`,
			message.channel,
			message.author,
		);

		// TODO
		// - send message back to user

		//fs.unlinkSync(`./src/files/purge/${message.guild.id}.txt`);
	}
};
