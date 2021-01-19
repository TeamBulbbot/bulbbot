const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			devOnly: true,
		});
	}

	async run(message, args) {
		const embed = new Discord.MessageEmbed()
		.setTitle("Discord Testers")
			.setThumbnail("https://cdn.discordapp.com/icons/197038439483310086/cd91b75395f029d6f6ac52110c4e9a91.webp?size=256")
			.setDescription("Hello,\n" +
				"Discord Testers is focused on maintaining a safe and secure environment for our community, and you account was flagged for violations of our server rules.\n" +
				"\n" +
				"Test warn, plz ignore\n" +
				"\n" +
				"Your actions are in violation of our server rules and are issuing you this warning. This is your 1st official warning on record. If the behavior continues, we may take further action against your account, up to and including permanent removal from the server.\n" +
				"~~Sincerely,\n" +
				"Discord Trust and Safety~~");

		message.channel.send(embed)
	}
};
