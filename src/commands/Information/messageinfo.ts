import BulbBotClient from "../../structures/BulbBotClient";
import { CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { ApplicationCommandOptionTypes } from "discord.js/typings/enums";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { resolveGuildMemberMoreSafe } from "../../utils/helpers";
import { APIGuildMember } from "discord-api-types/v9";
import { embedColor } from "../../Config";
import { ChannelMessage } from "../../utils/Regex";

export default class extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Returns some useful information about a message",
			options: [
				{
					name: "message_link",
					type: ApplicationCommandOptionTypes.STRING,
					description: "A message link to the message you want information about",
					required: true,
				},
			],
			client_permissions: ["EMBED_LINKS"],
			command_permissions: ["MANAGE_MESSAGES"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		let input: string | string[] = interaction.options.getString("message_link", true);
		let channelId: string;
		let messageId: string;

		if (ChannelMessage.test(input)) {
			input = input.split("-");
			channelId = input[0];
			messageId = input[1];
		} else {
			input = input.split("/");
			channelId = input[input.length - 2];
			messageId = input[input.length - 1];
		}

		const channel = interaction.guild?.channels.cache.get(channelId);
		const member = resolveGuildMemberMoreSafe(interaction.member as GuildMember | APIGuildMember);
		if (!channel || !interaction.member || (channel.type !== "GUILD_TEXT" && channel.type !== "GUILD_NEWS" && !channel.permissionsFor(member).has("VIEW_CHANNEL", true))) {
			await interaction.reply({
				ephemeral: true,
				content: await this.client.bulbutils.translate("messageinfo_channel_not_found", interaction.guild?.id, {}),
			});
			return;
		}

		let message: Message;
		try {
			// @ts-expect-error It's a try-catch it's fine
			message = await channel.messages.fetch(messageId);
		} catch (error) {
			await interaction.reply({
				ephemeral: true,
				content: await this.client.bulbutils.translate("messageinfo_message_not_found", interaction.guild?.id, {}),
			});
			return;
		}

		const desc: string[] = [
			`**ID:** ${message.id}`,
			`**Author:** ${message.author.tag} \`(${message.author.id})\``,
			`**Pinned:** ${message.pinned}`,
			`**TTS:** ${message.tts}`,
			`**System:** ${message.system}`,
			`**Created:** <t:${Math.round(message.createdTimestamp / 1000)}> (<t:${Math.round(message.createdTimestamp / 1000)}:R>)`,
			`\n**Content:**\n> ${message.content}`,
		];

		const row: MessageActionRow = new MessageActionRow().addComponents([
			new MessageButton().setStyle("LINK").setLabel("Jump to message").setURL(`https://discord.com/channels/${interaction.guild?.id}/${channel.id}/${message.id}`),
		]);

		const embed = new MessageEmbed()
			.setColor(embedColor)
			.setDescription(desc.join("\n"))
			.setFooter({
				text: await this.client.bulbutils.translate("global_executed_by", interaction.guild?.id, {
					user: interaction.user,
				}),
				iconURL: interaction.user.avatarURL({ dynamic: true }) || "",
			})
			.setTimestamp();

		await interaction.reply({ embeds: [embed], components: [row] });
	}
}
