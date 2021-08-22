import Command from "../../structures/Command";
import { Message, Snowflake, TextChannel } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import parse from "parse-duration";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Sets a slowmode to the selected channel",
			category: "Moderation",
			usage: "[channel] <duration>",
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
		const channel: TextChannel | null = targetChannel ? <TextChannel>await message.guild?.channels.fetch(targetChannel).catch(() => null) : null;

		if (!channel)
			return message.channel.send({
				content: await this.client.bulbutils.translate("global_not_found", message.guild?.id, {
					type: await this.client.bulbutils.translate("global_not_found_types.channel", message.guild?.id, {}),
					arg_expected: "channel:Channel",
					arg_provided: args[0],
					usage: this.usage,
				}),
				allowedMentions: {
					parse: ["everyone", "roles", "users"],
				},
			});

		if (args.length === 1) duration = <number>parse(args[0]);
		else duration = <number>parse(args[1]);

		if (duration < <number>parse("0s") || duration === null) return message.channel.send(await this.client.bulbutils.translate("duration_invalid_0s", message.guild?.id, {}));
		if (duration > <number>parse("6h")) return message.channel.send(await this.client.bulbutils.translate("duration_invalid_6h", message.guild?.id, {}));

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
	}
}
