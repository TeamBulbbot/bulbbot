const Command = require("../../structures/Command");
const DatabaseManager = new (require("../../utils/database/DatabaseManager"));
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Configure the autole in your server",
			category: "Configuration",
			aliases: ["ar"],
			usage: "!autorole <role>",
			examples: ["autorole @Cool Role", "autorole 787036080746397759"],
			argList: ["role:Role"],
			minArgs: 1,
			maxArgs: 1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["MANAGE_ROLES"],
		});
	}

	async run(message, args) {
		let role = null;
		if (args[0] !== "disable") {
			role = message.guild.roles.cache.get(args[0].replace(NonDigits, ""));
			if (message.guild.me.roles.highest.rawPosition < role.rawPosition)
				return message.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage", message.guild.id));
		}
		if (role === undefined) return message.channel.send(await this.client.bulbutils.translate("config_mute_invalid_role", message.guild.id));

		if (role !== null) {
			await DatabaseManager.setAutoRole(message.guild.id, role.id);
			return message.channel.send(await this.client.bulbutils.translate("config_autorole_success", message.guild.id));
		} else {
			await DatabaseManager.setAutoRole(message.guild.id, null);
			return message.channel.send(await this.client.bulbutils.translate("config_autorole_disable", message.guild.id));
		}
	}
};
