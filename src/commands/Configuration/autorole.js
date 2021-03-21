const Command = require("../../structures/Command");
const { ChangeAutoRole } = require("../../utils/configuration/GuildConfiguration");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Configure the autole in your server",
			category: "Configuration",
			aliases: ["ar"],
			usage: "!autorole <Role>",
			examples: ["autorole @Cool Role", "autorole 787036080746397759"],
			argList: ["role:Role"],
			minArgs: 1,
			maxArgs: 1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			premium: true,
		});
	}

	async run(message, args) {
		const role = message.guild.roles.cache.get(args[0]);
		if (role === undefined) return message.channel.send(await this.client.bulbutils.translate("config_mute_invalid_role"));
		if (message.guild.me.roles.highest.rawPosition < role.rawPosition)
			return message.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage"));

		await ChangeAutoRole(message.guild.id, role.id);
		message.channel.send(await this.client.bulbutils.translate("config_autorole_success"))
	}
};
