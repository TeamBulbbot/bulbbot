import { Message } from "discord.js";
import Command from "src/structures/Command";

export default interface ResolveCommandOptions {
	message: Message,
	baseCommand: Command,
	args: string[],
	clearance: number,
	premiumGuild: boolean,
	isDev: boolean,
	isSubDev: boolean,
}
