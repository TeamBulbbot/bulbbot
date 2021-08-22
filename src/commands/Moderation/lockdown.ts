import Command from "../../structures/Command";
import { Channel, GuildChannel, Message, Role } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Locks/unlocks a selected channel",
			category: "Moderation",
			usage: "<channel> <true|false>",
			examples: ["lockdown 743855098073186435 true", "lockdown #general false"],
			argList: ["channel:Channel", "lock:boolean"],
			minArgs: 2,
			maxArgs: 2,
			clearance: 50,
			userPerms: ["MANAGE_CHANNELS"],
			clientPerms: ["MANAGE_CHANNELS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message | Channel> {
		// @ts-ignore
		const channel: GuildChannel = message.guild?.channels.cache.get(args[0].replace(NonDigits, ""));
		if (!channel || channel.type !== "GUILD_TEXT") {
			return await message.channel.send({
				content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.channel", message.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "channel:Channel",
					usage: this.usage,
				}),
				allowedMentions: {
					parse: ["everyone", "roles", "users"],
				},
			});
		}

		if (args[1] !== "true" && args[1] !== "false") {
			return await message.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", message.guild?.id, {
					arg_provided: args[1],
					arg_expected: "lock:boolean",
					usage: this.usage,
				}),
			);
		}

		if (args[1] === "true") {
			await message.channel.send(await this.client.bulbutils.translate("lockdown_locked", message.guild?.id, { channel }));
			return channel?.permissionOverwrites.edit(<Role>message.guild?.roles.everyone, { SEND_MESSAGES: false });
		} else {
			await channel?.permissionOverwrites.edit(<Role>message.guild?.roles.everyone, { SEND_MESSAGES: null });
			return await message.channel.send(await this.client.bulbutils.translate("lockdown_unlocked", message.guild?.id, { channel }));
		}
	}
}
