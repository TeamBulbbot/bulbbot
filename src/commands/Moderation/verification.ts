import Command from "../../structures/Command";
import { Guild, Message } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import LoggingManager from "../../utils/managers/LoggingManager";

const loggingManager: LoggingManager = new LoggingManager();

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Changes the server verification level",
			category: "Moderation",
			usage: "!verification <level>",
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
		if (!level && level !== 0) return message.channel.send(await this.client.bulbutils.translate("verification_non_integer", message.guild?.id));
		if (message.guild?.features.includes("COMMUNITY") && level === 0) return message.channel.send(await this.client.bulbutils.translate("verification_community_zero", message.guild.id));

		if (level > 4 || level < 0) return message.channel.send(await this.client.bulbutils.translate("verification_level_error", message.guild?.id));

		await message.guild?.setVerificationLevel(level);
		await message.channel.send(await this.client.bulbutils.translate("verification_level_success", message.guild?.id, { level }));

		await loggingManager.sendServerEventLog(
			this.client,
			<Guild>message.guild,
			await this.client.bulbutils.translate("global_server_event", message.guild?.id, {
				moderator_tag: message.author.tag,
				moderator_id: message.author.id,
				part: await this.client.bulbutils.translate("verification_log", message.guild?.id, { level }),
			}),
		);
	}
}
