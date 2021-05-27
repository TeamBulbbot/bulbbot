import Command from "../../structures/Command";
import { Message, MessageEmbed } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import InfractionsManager from "../../utils/managers/InfractionsManager";
import { embedColor } from "../../structures/Config";

const infractionsManager: InfractionsManager = new InfractionsManager();

// @ts-nocheck
export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Returns some useful info about a user",
			category: "Information",
			aliases: ["whois", "info", "user"],
			usage: "!userinfo [user]",
			examples: ["userinfo", "userinfo 190160914765316096", "userinfo @mrphilip#0001"],
			clearance: 50,
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		let target: string;
		if (args[0] === undefined) target = message.author.id;
		else target = args[0].replace(NonDigits, "");

		let user: any = message.guild?.member(target);
		let isGuildMember = true;

		if (!user) {
			try {
				user = await this.client.users.fetch(target);
				isGuildMember = false;
			} catch (error) {
				await message.channel.send(
					await this.client.bulbutils.translate("global_user_not_found", message.guild?.id, {
						arg_expected: "user:User",
						arg_provided: args[0],
						usage: this.usage,
					}),
				);
			}
		}

		user = this.client.bulbutils.userObject(isGuildMember, user);

		let description: string = "";

		if (user !== undefined && user) {
			if (user.flags !== null) description += this.client.bulbutils.badges(user.flags.bitfield) + "\n";
			description += await this.client.bulbutils.translate("userinfo_embed_id", message.guild?.id, { user_id: user.id });
			description += await this.client.bulbutils.translate("userinfo_embed_username", message.guild?.id, { user_name: user.username });
			if (user.nickname !== null && user.nickname)
				description += await this.client.bulbutils.translate("userinfo_embed_nickname", message.guild?.id, { user_nickname: user.nickname });
			description += await this.client.bulbutils.translate("userinfo_embed_profile", message.guild?.id, { user_id: user.id });
			description += await this.client.bulbutils.translate("userinfo_embed_avatar", message.guild?.id, { user_avatar: user.avatarUrl });
			description += await this.client.bulbutils.translate("userinfo_embed_bot", message.guild?.id, { user_bot: user.bot });
			description += await this.client.bulbutils.translate("userinfo_embed_created", message.guild?.id, { user_age: user.createdAt });

			if (user.premiumSinceTimestamp !== undefined && user.premiumSinceTimestamp && user.premiumSinceTimestamp > 0)
				description += await this.client.bulbutils.translate("userinfo_embed_premium", message.guild?.id, {
					user_premium: user.premiumSinceTimestamp,
				});

			if (user.joinedTimestamp !== undefined && user.joinedTimestamp)
				description += await this.client.bulbutils.translate("userinfo_embed_joined", message.guild?.id, { user_joined: user.joinedTimestamp });

			if (user.roles !== undefined && user.roles)
				description += await this.client.bulbutils.translate("userinfo_embed_roles", message.guild?.id, {
					user_roles: user.roles.cache.map(r => `${r}`).join(", "),
				});

			const infs = await infractionsManager.getOffenderInfractions(<string>message.guild?.id, user.id);
			// @ts-ignore
			description += await this.client.bulbutils.translate("userinfo_embed_infractions", message.guild?.id, { user_infractions: infs.length });

			let color;
			if (user.roles === undefined || user.roles?.highest.name === "@everyone") color = embedColor;
			else color = user.roles?.highest.hexColor;

			const embed: MessageEmbed = new MessageEmbed()
				.setColor(color)
				.setThumbnail(user.avatarUrl)
				.setAuthor(`${user.username}#${user.discriminator}`, user.avatarUrl)
				.setDescription(description)
				.setFooter(
					await this.client.bulbutils.translate("global_executed_by", message.guild?.id, {
						user_name: message.author.username,
						user_discriminator: message.author.discriminator,
					}),
					<string>message.author.avatarURL({ dynamic: true }),
				)
				.setTimestamp();

			await message.channel.send(embed);
		}
	}
}