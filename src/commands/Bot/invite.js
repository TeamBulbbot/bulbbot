const Command = require("../../structures/Command");
const Discord = require("discord.js");

module.exports = class extends (
	Command
) {
	constructor(...args) {
		super(...args, {
			description: "Returns the invite link for the bot and the support guild",
			category: "Bot",
			usage: "!invite",
		});
	}

	async run(message, args) {
		const botInvite = `https://discord.com/oauth2/authorize?client_id=${global.config.client.id}&scope=bot&permissions=1544940655`;
		const guildInvite = global.config.supportInvite;

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setDescription(this.client.bulbutils.translate("invite_desc", { bot_invite: botInvite, support_guild: guildInvite }))
			.setFooter(
				this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				message.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};