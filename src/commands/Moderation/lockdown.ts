import { BaseGuildVoiceChannel, CommandInteraction, Role, TextChannel } from "discord.js";
import BulbBotClient from "../../structures/BulbBotClient";
import ApplicationCommand from "../../structures/ApplicationCommand";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType } from "discord-api-types/v10";

export default class Lockdown extends ApplicationCommand {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Locks/unlocks the selected channel",
			type: ApplicationCommandType.ChatInput,
			options: [
				{
					name: "channel",
					description: "The channel to lock/unlock",
					type: ApplicationCommandOptionType.Channel,
					required: true,
					channel_types: [ChannelType.GuildText],
				},
				{
					name: "lock",
					description: "Whether to lock or unlock the channel",
					type: ApplicationCommandOptionType.Boolean,
					required: true,
				},
			],
			command_permissions: ["MANAGE_CHANNELS"],
			client_permissions: ["MANAGE_CHANNELS"],
		});
	}

	public async run(interaction: CommandInteraction): Promise<void> {
		const channel = interaction.options.getChannel("channel") as TextChannel | BaseGuildVoiceChannel;
		const lock = interaction.options.getBoolean("lock") as boolean;

		if (lock) {
			await channel.permissionOverwrites.edit(interaction.guild?.roles.everyone as Role, { SEND_MESSAGES: false });
			return interaction.reply(await this.client.bulbutils.translate("lockdown_locked", interaction.guild?.id, { channel }));
		} else {
			await channel.permissionOverwrites.edit(interaction.guild?.roles.everyone as Role, { SEND_MESSAGES: null });
			return interaction.reply(await this.client.bulbutils.translate("lockdown_unlocked", interaction.guild?.id, { channel }));
		}
	}
}
