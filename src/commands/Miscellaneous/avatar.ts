import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { MessageEmbed } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import { embedColor } from "../../Config";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Gets a users avatar picture",
			category: "Miscellaneous",
			usage: "[user]",
			examples: ["avatar", "avatar 190160914765316096", "avatar @mrphilip#0001"],
			argList: ["user:User"],
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext, args: string[]) {
		let id;
		if (args[0] === undefined) id = context.author.id;
		else id = args[0].replace(NonDigits, "");
		let user;
		try {
			user = await this.client.bulbfetch.getUser(id);
		} catch (error) {
			return context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "user:User",
					usage: this.usage,
				}),
			);
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
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				await this.client.bulbutils.userObject(false, context.author).avatarUrl,
			)
			.setTimestamp();

		return context.channel.send({ embeds: [embed] });
	}
}
