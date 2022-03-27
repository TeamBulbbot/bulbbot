import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import BulbBotClient from "../../structures/BulbBotClient";
import { NonDigits } from "../../utils/Regex";
import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { embedColor } from "../../Config";
import { isTextChannel } from "../../utils/typechecks";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a channel",
			category: "Information",
			usage: "[channel]",
			examples: ["channelinfo", "channelinfo 742095521962786858", "channelinfo #rules"],
			clearance: 50,
			maxArgs: 1,
			clientPerms: ["EMBED_LINKS"],
			argList: ["channel:Channel"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		let channelId: string;
		if (args[0] === undefined) channelId = context.channel.id;
		else channelId = args[0].replace(NonDigits, "");

		const channel = context.guild?.channels.cache.get(channelId);
		if (!(context.member && channel?.permissionsFor(context.member)?.has("VIEW_CHANNEL", true))) {
			context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.channel", context.guild?.id, {}),
					arg_expected: "channel:Channel",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);
			return;
		}
		const desc: string[] = [`**ID:** ${channel.id}`, `**Name:** ${channel.name}`, `**Mention:** <#${channel.id}>`];
		channel.parentId !== null ? desc.push(`**Parent:** ${channel.parent?.name}`) : "";
		const buttons: MessageButton[] = [];

		if (isTextChannel(channel)) {
			channel.lastMessageId !== null
				? buttons.push(new MessageButton().setStyle("LINK").setLabel("Latest message").setURL(`https://discord.com/channels/${context.guild?.id}/${channel.id}/${channel.lastMessageId}`))
				: null;

			channel.rateLimitPerUser > 0 ? desc.push(`**Slowmode:** ${channel.rateLimitPerUser} seconds`) : null;
			channel.topic !== null ? desc.push(`**Topic:** ${channel.topic}`) : null;
			desc.push(`**NSFW:** ${channel.nsfw}`);
			desc.push(
				`\n**Your permissions:** ${channel
					.permissionsFor(context.author)
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
					.permissionsFor(context.author)
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
				text: await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				iconURL: <string>context.author.avatarURL({ dynamic: true }),
			})
			.setTimestamp();

		buttons.length > 0 ? context.channel.send({ embeds: [embed], components: [new MessageActionRow().addComponents(buttons)] }) : context.channel.send({ embeds: [embed] });
	}
}
