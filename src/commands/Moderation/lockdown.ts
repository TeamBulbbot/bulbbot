import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { Channel, GuildChannel, Message, ThreadChannel } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Locks/unlocks a selected channel",
			category: "Moderation",
			usage: "<channel> <true|false>",
			examples: ["lockdown 742095521962786858 true", "lockdown #general false"],
			argList: ["channel:ChannelText", "lock:Boolean"],
			minArgs: 2,
			maxArgs: 2,
			clearance: 50,
			userPerms: ["MANAGE_CHANNELS"],
			clientPerms: ["MANAGE_CHANNELS"],
		});
	}

	async run(context: CommandContext, args: string[]): Promise<void | Message | Channel> {
		const channel: GuildChannel | ThreadChannel | null | undefined = await this.client.bulbfetch.getChannel(context.guild?.channels, args[0].replace(NonDigits, ""));
		if (!channel || channel.type !== "GUILD_TEXT") {
			return await context.channel.send(
				await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.channel", context.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "channel:ChannelText",
					usage: this.usage,
				}),
			);
		}

		if (args[1] !== "true" && args[1] !== "false") {
			return await context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					arg_provided: args[1],
					arg_expected: "lock:Boolean",
					usage: this.usage,
				}),
			);
		}

		if (!context.guild) return;

		if (args[1] === "true") {
			await context.channel.send(await this.client.bulbutils.translate("lockdown_locked", context.guild.id, { channel }));
			return channel?.permissionOverwrites.edit(context.guild.roles.everyone, { SEND_MESSAGES: false });
		} else {
			await channel?.permissionOverwrites.edit(context.guild.roles.everyone, { SEND_MESSAGES: null });
			return await context.channel.send(await this.client.bulbutils.translate("lockdown_unlocked", context.guild.id, { channel }));
		}
	}
}
