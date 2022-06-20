import BulbBotClient from "../../structures/BulbBotClient";
import { CommandInteraction, GuildChannel, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { resolveGuildChannelMoreSafe } from "../../utils/helpers";
import { APIChannel } from "discord-api-types/v9";
import { embedColor } from "../..//Config";
import { isTextChannel } from "../..//utils/typechecks";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a channel",

			options: [
				{
					name: "channel",
					type: ApplicationCommandOptionTypes.CHANNEL,
					description: "The channel you want more info about",
					required: true,
				},
			],
			command_permissions: ["MANAGE_CHANNELS"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(interaction: CommandInteraction): Promise<void> {
		const channel = resolveGuildChannelMoreSafe(interaction.options.getChannel("channel", true) as GuildChannel | APIChannel);

		const desc: string[] = [`**ID:** ${channel.id}`, `**Name:** ${channel.name}`, `**Mention:** <#${channel.id}>`];
		channel.parentId !== null ? desc.push(`**Parent:** ${channel.parent?.name}`) : "";
		const buttons: MessageButton[] = [];

		if (isTextChannel(channel)) {
			channel.lastMessageId !== null
				? buttons.push(new MessageButton().setStyle("LINK").setLabel("Latest message").setURL(`https://discord.com/channels/${interaction.guild?.id}/${channel.id}/${channel.lastMessageId}`))
				: null;

			channel.rateLimitPerUser > 0 ? desc.push(`**Slowmode:** ${channel.rateLimitPerUser} seconds`) : null;
			channel.topic !== null ? desc.push(`**Topic:** ${channel.topic}`) : null;
			desc.push(`**NSFW:** ${channel.nsfw}`);
			desc.push(
				`\n**Your permissions:** ${channel
					.permissionsFor(interaction.user)
					?.toArray()
					.map((p) => `\`${p}\``)
					.join(" ")}`,
			);
		} else if (channel.isVoice()) {
			desc.push(`**RTC region:** ${channel.rtcRegion === null ? "Automatic" : channel.rtcRegion}`);
			desc.push(`**User limit:** ${channel.userLimit === 0 ? "Unlimited" : channel.userLimit}`);
			desc.push(`**Bitrate:** ${channel.bitrate}`);

			desc.push(
				`\n**Your permissions:** ${channel
					.permissionsFor(interaction.user)
					?.toArray()
					.map((p) => `\`${p}\``)
					.join(" ")}`,
			);
		}

		const channelType: string = channel.type.replaceAll("_", " ").toLowerCase();

		const embed = new MessageEmbed()
			.setAuthor({
				name: channelType.charAt(0).toUpperCase() + channelType.slice(1),
			})
			.setColor(embedColor)
			.setDescription(desc.join("\n"))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		buttons.length > 0 ? interaction.reply({ embeds: [embed], components: [new MessageActionRow().addComponents(buttons)] }) : interaction.reply({ embeds: [embed] });
	}
}
