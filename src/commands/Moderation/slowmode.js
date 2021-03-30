const Command = require("../../structures/Command");
const parse = require("parse-duration");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Sets a slowmode to the selected channel",
			category: "Moderation",
			usage: "!slowmode [channel] <duration>",
			examples: ["slowmode 60m", "slowmode 743855098073186435 30m", "slowmode #general 0s"],
			argList: ["duration:Duration"],
			minArgs: 1,
			maxArgs: 2,
			clearance: 50,
			userPerms: ["MANAGE_CHANNELS"],
			clientPerms: ["MANAGE_CHANNELS"],
		});
	}

	async run(message, args) {
		let duration;
		let targetChannel = args[0].replace(NonDigits, "");
		if (!args[1]) targetChannel = message.channel.id;
		const channel = message.guild.channels.cache.get(targetChannel);

		if (!channel) return message.channel.send(await this.client.bulbutils.translate("global_channel_not_found", message.guild.id));

		if (args.length === 1) duration = parse(args[0]);
		else duration = parse(args[1]);

		if (duration < parse("0s") || duration === null)
			return message.channel.send(await this.client.bulbutils.translate("slowmode_invalid_0s", message.guild.id));
		if (duration > parse("6h")) return message.channel.send(await this.client.bulbutils.translate("slowmode_invalid_6h", message.guild.id));

		await channel.setRateLimitPerUser(duration / 1000);

		if (duration === parse("0s"))
			message.channel.send(await this.client.bulbutils.translate("slowmode_success_remove", message.guild.id, { channel }));
		else if (args.length === 1)
			message.channel.send(
				await this.client.bulbutils.translate("slowmode_success", {
					channel,
					slowmode: args[0],
				}),
			);
		else message.channel.send(await this.client.bulbutils.translate("slowmode_success", message.guild.id, { channel, slowmode: args[1] }));
	}
};
