import Command from "../../structures/Command";
import { Message } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Changes the server verification level",
			category: "Moderation",
			usage: "<level>",
			examples: ["verification 2"],
			argList: ["level:int"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
			clientPerms: ["MANAGE_GUILD"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const level: number = parseInt(args[0].replace(NonDigits, ""));
		if (!level && level !== 0)
			return message.channel.send(
				await this.client.bulbutils.translateNew("global_cannot_convert", message.guild?.id, {
					arg_provided: args[0],
					arg_expected: "verification:int",
					usage: this.usage,
				}),
			);
		if (message.guild?.features.includes("COMMUNITY") && level === 0) return message.channel.send(await this.client.bulbutils.translateNew("verification_community_zero", message.guild.id, {}));

		if (level > 4 || level < 0) return message.channel.send(await this.client.bulbutils.translateNew("verification_level_error", message.guild?.id, {}));

		await message.guild?.setVerificationLevel(level);
		await message.channel.send(await this.client.bulbutils.translateNew("verification_level_success", message.guild?.id, { level }));
	}
}
