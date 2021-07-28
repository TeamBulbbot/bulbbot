import { Message, MessageEmbed } from "discord.js";
import Command from "../../structures/Command";
import { NonDigits } from "../../utils/Regex";
import { embedColor } from "../../Config";

export default class extends Command {
	constructor(...args: any) {
        // @ts-ignore
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

	async run(message: Message, args: string[]) {
		let id;
		if (args[0] === undefined) id = message.author.id;
		else id = args[0].replace(NonDigits, "");
		let user;
		try {
			user = await this.client.users.fetch(id);
		} catch (error) {
			return message.channel.send(await this.client.bulbutils.translate("global_user_not_found", message.guild?.id));
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

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setAuthor(`${user.tag} (${user.id})`, user.avatar !== null ? user.avatarURL({ dynamic: true }) : avatar)
			.setDescription(desc)
			.setImage(user.avatar !== null ? user.avatarURL({ dynamic: true, size: 4096 }) : avatar)
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
					user_name: message.author.username,
					user_discriminator: message.author.discriminator,
				}),
				await this.client.bulbutils.userObject(false, message.author).avatarUrl,
			)
			.setTimestamp();

		return message.channel.send(embed);
	}
};
