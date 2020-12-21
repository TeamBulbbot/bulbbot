const Command = require("../../structures/Command");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Changes the server verification level",
			category: "Moderation",
			usage: "!verification <level>",
			argList: ["level:integer"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 50,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["MANAGE_GUILD"],
		});
	}

	async run(message, args) {
		const level = parseInt(args[0].replace(NonDigits, ""));
		if (level === "") return message.channel.send(this.client.bulbutils.translate("verification_non_integer"));
		if (message.guild.features.includes("COMMUNITY") && level === 0)
			return message.channel.send(this.client.bulbutils.translate("verification_community_zero"));

		if (level > 4 || level < 0) return message.channel.send(this.client.bulbutils.translate("verification_level_error"));

		await message.guild.setVerificationLevel(level);
		message.channel.send(this.client.bulbutils.translate("verification_level_success", { level }));
	}
};
