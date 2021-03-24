const Discord = require("discord.js");
const Command = require("../../structures/Command");
const { NonDigits } = require("../../utils/Regex");

module.exports = class extends Command {
	constructor(...args) {
		super(...args, {
			description: "Gets a users avatar picture",
			category: "Miscellaneous",
			usage: "!avatar [user]",
			examples: ["avatar", "avatar 190160914765316096", "avatar @mrphilip#0001"],
			argList: ["user:User"],
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(message, args) {
		let id;
		if (args[0] === undefined) id = message.author.id;
		else id = args[0].replace(NonDigits, "");
		let user;
		try {
			user = await this.client.users.fetch(id);
		} catch (error) {
			return message.channel.send(await this.client.bulbutils.translate("global_user_not_found"));
		}

		let desc = "";
		const formats = ["png", "jpg", "webp"];
		const sizes = [64, 128, 512, 4096];
		if (user.avatar !== null && user.avatarURL({ dynamic: true }).endsWith(".gif")) {
			desc += "**gif: **";
			sizes.forEach(size => {
				desc += `[[${size}]](${user.avatarURL({ format: "gif", size })}) `;
			});
		}
		let avatar;

		formats.forEach(format => {
			desc += `\n**${format}: **`;
			sizes.forEach(size => {
				if (user.avatar === null) avatar = `https://cdn.discordapp.com/embed/avatars/${user.discriminator % 5}.png`;
				else avatar = user.avatarURL({ format, size });

				desc += `[[${size}]](${avatar}) `;
			});
		});

		const embed = new Discord.MessageEmbed()
			.setColor(global.config.embedColor)
			.setAuthor(`${user.tag} (${user.id})`, user.avatar !== null ? user.avatarURL({ dynamic: true }) : avatar)
			.setDescription(desc)
			.setImage(user.avatar !== null ? user.avatarURL({ dynamic: true, size: 4096 }) : avatar)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", {
					user_name: await this.client.bulbutils.userObject(true, message.member).username,
					user_discriminator: await this.client.bulbutils.userObject(true, message.member).discriminator,
				}),
				await this.client.bulbutils.userObject(true, message.member).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};
