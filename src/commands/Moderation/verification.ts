import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
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

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const level: number = parseInt(args[0].replace(NonDigits, ""));
		if (!level && level !== 0)
			return context.channel.send(
				await this.client.bulbutils.translate("global_cannot_convert", context.guild?.id, {
					arg_provided: args[0],
					arg_expected: "verification:int",
					usage: this.usage,
				}),
			);
		if (context.guild?.features.includes("COMMUNITY") && level === 0) return context.channel.send(await this.client.bulbutils.translate("verification_community_zero", context.guild.id, {}));

		if (level > 4 || level < 0) return context.channel.send(await this.client.bulbutils.translate("verification_level_error", context.guild?.id, {}));

		await context.guild?.setVerificationLevel(level);
		await context.channel.send(await this.client.bulbutils.translate("verification_level_success", context.guild?.id, { level }));
	}
}
