import { User, CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { APIGuildMember, ApplicationCommandOptionType, ApplicationCommandType } from "discord-api-types/v9";
import { resolveGuildMemberMoreSafe } from "../../utils/helpers";
import { embedColor } from "../../Config";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Gets a users avatar picture",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "user",
					type: ApplicationCommandOptionType.User,
					description: "The user you want to view the avatar of",
					required: false,
				},
			],
			command_permissions: ["MUTE_MEMBERS"],
			client_permissions: ["EMBED_LINKS"],
		});
	}

	public async run(interaction: CommandInteraction) {
		let user: User | GuildMember;

		if (interaction.options.getMember("user") !== null) user = resolveGuildMemberMoreSafe(interaction.options.getMember("user") as GuildMember | APIGuildMember);
		else if (interaction.options.getUser("user") !== null) user = interaction.options.getUser("user") as User;
		else user = resolveGuildMemberMoreSafe(interaction.member as GuildMember | APIGuildMember);

		const images: string[] = [];

		if (user instanceof GuildMember) {
			// @ts-expect-error
			if (user.avatar) images.push(user.avatarURL({ dynamic: true, size: 4096 }));
			// @ts-expect-error
			if (user.user.avatar) images.push(user.user.avatarURL({ dynamic: true, size: 4096 }));
			else images.push(`https://cdn.discordapp.com/embed/avatars/${Number(user.user.discriminator) % 5}.png`);
		} else {
			// @ts-expect-error
			if (user.avatar) images.push(user.avatarURL({ dynamic: true, size: 4096 }));
			else images.push(`https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}.png`);
		}

		const embeds = await Promise.all(
			images.map(async (image) => {
				return new MessageEmbed()
					.setColor(embedColor)
					.setAuthor({
						name: user instanceof GuildMember ? `${user.user.tag} (${user.user.id})` : `${user.tag} (${user.id})`,
					})
					.setURL("https://bulbbot.rocks/")
					.setFooter({
						text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
							user: interaction.user,
						}),
						iconURL: this.client.bulbutils.userObject(false, interaction.user)?.avatarUrl ?? undefined,
					})
					.setTimestamp()
					.setImage(image);
			}),
		);

		interaction.reply({
			embeds,
		});
	}
}
