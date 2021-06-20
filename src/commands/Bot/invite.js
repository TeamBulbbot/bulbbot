const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Returns the invite link for the bot and the support guild",
			category: "Bot",
			aliases: ["support"],
			usage: "!invite",
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message, args) {
		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(
				await this.client.bulbutils.translate("invite_desc", message.guild.id, {
					bot_invite: global.config.botInvite,
					support_guild: global.config.supportInvite,
				}),
			)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild.id, {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};
