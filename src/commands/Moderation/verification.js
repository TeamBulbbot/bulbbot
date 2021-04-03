const Command = require("../../structures/Command");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Changes the server verification level",
			category: "Moderation",
			usage: "!verification <level>",
			examples: ["verification 2"],
			argList: ["level:int"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["MANAGE_GUILD"],
		});
	}

	async run(message, args) {
		const level = parseInt(args[0].replace(NonDigits, ""));
		if (!level && level !== 0) return message.channel.send(await this.client.bulbutils.translate("verification_non_integer", message.guild.id));
		if (message.guild.features.includes("COMMUNITY") && level === 0)
			return message.channel.send(await this.client.bulbutils.translate("verification_community_zero", message.guild.id));

		if (level > 4 || level < 0) return message.channel.send(await this.client.bulbutils.translate("verification_level_error", message.guild.id));

		await message.guild.setVerificationLevel(level);
		message.channel.send(await this.client.bulbutils.translate("verification_level_success", message.guild.id, { level }));

		// TODO
		// - send this as a mod action log
	}
};
