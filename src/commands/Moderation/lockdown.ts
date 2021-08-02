import Command from "../../structures/Command";
import { Channel, Message, Role } from "discord.js";
import { NonDigits } from "../../utils/Regex";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Locks/unlocks a selected channel",
			category: "Moderation",
			usage: "!lockdown <channel> <true|false>",
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
		const channel = message.guild?.channels.cache.get(args[0].replace(NonDigits, ""));
		if (!channel) {
			return await message.channel.send(
				await this.client.bulbutils.translateNew("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translateNew("global_not_found_types.channel", message.guild?.id, {}),
					arg_provided: args[0],
					arg_expected: "channel:Channel",
					usage: this.usage,
				}),
			);
		}

		if (args[1] !== "true" && args[1] !== "false") {
			return await message.channel.send(
				await this.client.bulbutils.translateNew("global_cannot_convert", message.guild?.id, {
					arg_provided: args[1],
					arg_expected: "lock:boolean",
					usage: this.usage,
				}),
			);
		}

		if (args[1] === "true") {
			await message.channel.send(await this.client.bulbutils.translateNew("lockdown_locked", message.guild?.id, { channel }));
			return channel?.updateOverwrite(<Role>message.guild?.roles.everyone, { SEND_MESSAGES: false });
		} else {
			await channel?.updateOverwrite(<Role>message.guild?.roles.everyone, { SEND_MESSAGES: null });
			return await message.channel.send(await this.client.bulbutils.translateNew("lockdown_unlocked", message.guild?.id, { channel }));
		}
	}
}
