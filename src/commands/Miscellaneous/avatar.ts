import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { GuildMember, MessageEmbed, User } from "discord.js";
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
			examples: ["avatar", "avatar 123456789012345678", "avatar @Wumpus#0000"],
			argList: ["user:User"],
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext, args: string[]) {
		let id: string;
		if (args[0] === undefined) id = context.author.id;
		else id = args[0].replace(NonDigits, "");
		let user: GuildMember | User | undefined = await this.client.bulbfetch.getGuildMember(context.guild?.members, id);
		const isGuildMember = !!user;

		if (!user) {
			user = await this.client.bulbfetch.getUser(id);

			if (!user)
				return context.channel.send(
					await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
						type: await this.client.bulbutils.translate("global_not_found_types.user", context.guild?.id, {}),
						arg_provided: args[0],
						arg_expected: "user:User",
						usage: this.usage,
					}),
				);
		}

		let desc: string = "";
		let avatar: string | null = "";

		if (isGuildMember) {
			if (user.avatar) avatar = user.avatarURL({ dynamic: true, size: 4096 });
			// @ts-ignore
			else if (user.user.avatar === null) avatar = `https://cdn.discordapp.com/embed/avatars/${Number(user.user.discriminator) % 5}.png`;
			// @ts-ignore
			else avatar = user.user.avatarURL({ dynamic: true, size: 4096 });
		} else {
			if (user.avatar) avatar = user.avatarURL({ dynamic: true, size: 4096 });
			// @ts-ignore
			else avatar = `https://cdn.discordapp.com/embed/avatars/${Number(user.user.discriminator) % 5}.png`;
		}

		if (isGuildMember && user.avatar) {
			// @ts-ignore
			const normal = new MessageEmbed().setURL("https://bulbbot.rocks/").setImage(user.user.avatarURL({ dynamic: true }));
			const guild = new MessageEmbed()
				.setColor(embedColor) // @ts-ignore
				.setAuthor(`${user.user.tag} (${user.user.id})`)
				.setDescription(desc)
				.setURL("https://bulbbot.rocks/") // @ts-ignore
				.setImage(user.avatarURL({ dynamic: true, size: 4096 }))
				.setFooter(
					await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
						user: context.author,
					}),
					await this.client.bulbutils.userObject(false, context.author).avatarUrl,
				)
				.setTimestamp();

			return context.channel.send({ embeds: [guild, normal] });
		}

		const embed = new MessageEmbed()
			.setColor(embedColor) // @ts-ignore
			.setAuthor(isGuildMember ? `${user.user.tag} (${user.user.id})` : `${user.tag} (${user.id})`, avatar)
			.setDescription(desc) // @ts-ignore
			.setImage(avatar)
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
