import { CommandInteraction, GuildTextBasedChannel } from "discord.js";
import parse from "parse-duration";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord-api-types/v10";

export default class Slowmode extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Set the slowmode for a channel.",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "channel",
					description: "The channel to set the slowmode for.",
					type: ApplicationCommandOptionType.Channel,
					required: true,
					channel_types: [ChannelType.GuildText],
				},
				{
					name: "duration",
					description: "The duration of the slowmode.",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
			command_permissions: ["MANAGE_CHANNELS"],
			client_permissions: ["MANAGE_CHANNELS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const channel: GuildTextBasedChannel = interaction.options.getChannel("channel") as GuildTextBasedChannel;
		const duration: number = parse(interaction.options.getString("duration") as string, "second");

		if (duration < 0)
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_0s", interaction.guild?.id, {}),
				ephemeral: true,
			});
		if (duration > parse("6h", "second"))
			return interaction.reply({
				content: await this.client.bulbutils.translate("duration_invalid_6h", interaction.guild?.id, {}),
				ephemeral: true,
			});

		try {
			await channel.setRateLimitPerUser(duration);
		} catch (error) {
			return await interaction.reply({
				content: await this.client.bulbutils.translate("slowmode_missing_perms", interaction.guild?.id, {
					channel,
				}),
				ephemeral: true,
			});
		}

		if (duration === parse("0s", "second")) return interaction.reply(await this.client.bulbutils.translate("slowmode_success_remove", interaction.guild?.id, { channel }));

		return interaction.reply(
			await this.client.bulbutils.translate("slowmode_success", interaction.guild?.id, {
				channel,
				slowmode: interaction.options.getString("duration") as string,
			}),
		);
	}
}
