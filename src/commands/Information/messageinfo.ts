import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import BulbBotClient from "../../structures/BulbBotClient";
import { ChannelMessage } from "../../utils/Regex";
import { Message, MessageActionRow, MessageButton, MessageEmbed, NewsChannel, TextChannel } from "discord.js";
import { embedColor } from "../../Config";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful info about a message",
			category: "Information",
			usage: "<channel-message>",
			examples: ["messageinfo 742095521962786858-877632488023945246", "messageinfo https://discord.com/channels/742094927403679816/742095521962786858/877632488023945246"],
			clearance: 50,
			maxArgs: 1,
			minArgs: 1,
			argList: ["channel-message:Snowflake"],
			clientPerms: ["EMBED_LINKS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void> {
		let channelId: string;
		let messageId: string;
		let input: string | string[] = args[0];

		if (ChannelMessage.test(input)) {
			input = input.split("-");
			channelId = input[0];
			messageId = input[1];
		} else {
			input = input.split("/");
			channelId = input[input.length - 2];
			messageId = input[input.length - 1];
		}

		// @ts-ignore
		let channel: TextChannel | NewsChannel | undefined = context.guild?.channels.cache.get(channelId);
		if (channel?.type !== "GUILD_TEXT" && channel?.type !== "GUILD_NEWS" && !channel!?.permissionsFor(context.member!)?.has("VIEW_CHANNEL", true)) {
			context.channel.send(await this.client.bulbutils.translate("messageinfo_unable_to_find", context.guild!.id, {}));
			return;
		}
		let message: Message;
		try {
			message = await channel.messages.fetch(messageId);
		} catch (error) {
			context.channel.send(await this.client.bulbutils.translate("messageinfo_unable_to_find", context.guild!.id, {}));
			return;
		}

		const desc: String[] = [
			`**ID:** ${message.id}`,
			`**Author:** ${message.author.tag} \`(${message.author.id})\``,
			`**Pinned:** ${message.pinned}`,
			`**TTS:** ${message.tts}`,
			`**System:** ${message.system}`,
			`**Created:** <t:${Math.round(message.createdTimestamp / 1000)}> (<t:${Math.round(message.createdTimestamp / 1000)}:R>)`,
			`\n**Content:**\n> ${message.content}`,
		];

		const row: MessageActionRow = new MessageActionRow().addComponents([
			new MessageButton().setStyle("LINK").setLabel("Jump to message").setURL(`https://discord.com/channels/${context.guild?.id}/${channel.id}/${message.id}`),
		]);

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc.join("\n"))
			.setFooter(
				await this.client.bulbutils.translate("global_executed_by", context.guild?.id, {
					user: context.author,
				}),
				<string>context.author.avatarURL({ dynamic: true }),
			)
			.setTimestamp();

		context.channel.send({ embeds: [embed], components: [row] });
	}
}
