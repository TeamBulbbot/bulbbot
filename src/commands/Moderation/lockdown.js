const Command = require("../../structures/Command");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Locks/unlocks a selected channel",
			category: "Moderation",
			usage: "!lockdown <channel> <lock>",
			examples: ["lockdown 743855098073186435 true", "lockdown #general false"],
			argList: ["channel:Channel", "lock:boolean"],
			minArgs: 2,
			maxArgs: 2,
			clearance: 50,
			userPerms: ["MANAGE_CHANNELS"],
			clientPerms: ["MANAGE_CHANNELS"],
		});
	}

	async run(message, args) {
		// BUG
		// if missing perms = error

		const channel = message.guild.channels.cache.get(args[0].replace(NonDigits, ""));
		if (!channel) return message.channel.send(await this.client.bulbutils.translate("global_channel_not_found", message.guild.id));

		if (args[1] !== "true" && args[1] !== "false")
			return message.channel.send(await this.client.bulbutils.translate("lockdown_not_boolean", message.guild.id));
		if (args[1] === "true") {
			message.channel.send(await this.client.bulbutils.translate("lockdown_locked", message.guild.id, { channel }));
			return await channel.updateOverwrite(message.guild.roles.everyone.id, { SEND_MESSAGES: false });
		} else {
			await channel.updateOverwrite(message.guild.roles.everyone.id, { SEND_MESSAGES: true });
			return message.channel.send(await this.client.bulbutils.translate("lockdown_unlocked", message.guild.id, { channel }));
		}
	}
};
