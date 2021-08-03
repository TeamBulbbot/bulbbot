import Command from "../../structures/Command";
import { Guild, Message, Snowflake, TextChannel } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import parse from "parse-duration";
import LoggingManager from "../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Sets a slowmode to the selected channel",
			category: "Moderation",
			usage: "slowmode [channel] <duration>",
			examples: ["slowmode 60m", "slowmode 123456789012345678 30m", "slowmode #general 0s"],
			argList: ["duration:Duration"],
			minArgs: 1,
			maxArgs: 2,
			clearance: 50,
			userPerms: ["MANAGE_CHANNELS"],
			clientPerms: ["MANAGE_CHANNELS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		let duration: number;
		let targetChannel: Snowflake = args[0].replace(NonDigits, "");
		if (!args[1]) targetChannel = message.channel.id;
		const channel: TextChannel = <TextChannel>message.guild?.channels.cache.get(targetChannel);

		if (!channel)
			return message.channel.send(
				await this.client.bulbutils.translate("global_channel_not_found", message.guild?.id, {
					arg_expected: "channel:Channel",
					arg_provided: args[0],
					usage: this.usage,
				}),
			);

		if (args.length === 1) duration = <number>parse(args[0]);
		else duration = <number>parse(args[1]);

		if (duration < <number>parse("0s") || duration === null) return message.channel.send(await this.client.bulbutils.translate("slowmode_invalid_0s", message.guild?.id));
		if (duration > <number>parse("6h")) return message.channel.send(await this.client.bulbutils.translate("slowmode_invalid_6h", message.guild?.id));

		const before: number = channel.rateLimitPerUser;
		try {
			await channel.setRateLimitPerUser(duration / 1000);
		} catch (error) {
			return await message.channel.send(
				await this.client.bulbutils.translate("slowmode_missing_perms", message.guild?.id, {
					channel,
				}),
			);
		}

		if (duration === parse("0s")) await message.channel.send(await this.client.bulbutils.translate("slowmode_success_remove", message.guild?.id, { channel }));
		else if (args.length === 1)
			await message.channel.send(
				await this.client.bulbutils.translate("slowmode_success", message.guild?.id, {
					channel,
					slowmode: args[0],
				}),
			);
		else
			await message.channel.send(
				await this.client.bulbutils.translate("slowmode_success", message.guild?.id, {
					channel,
					slowmode: args[1],
				}),
			);

		await loggingManager.sendServerEventLog(
			this.client,
			<Guild>message.guild,
			await this.client.bulbutils.translate("global_channel_event", message.guild?.id, {
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				channel_id: channel.id,
				part: await this.client.bulbutils.translate("slowmode_log", message.author.id, {
					before,
					after: duration / 1000,
				}),
			}),
		);
	}
}
