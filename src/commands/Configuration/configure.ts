import Command from "../../structures/Command";
import { Message } from "discord.js";
import muterole from "./configure/muterole";
import timezone from "./configure/timezone";
import prefix from "./configure/prefix";
import logging from "./configure/logging";
import autorole from "./configure/autorole";
import override from "./override/override";
import automod from "./configure/automod";

export default class extends Command {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			description: "Configure the bot in your server",
			category: "Configuration",
			subCommands: [muterole, timezone, prefix, logging, autorole, override, automod],
			aliases: ["cfg", "conf", "config", "setting"],
			usage: "!configure <part>",
			examples: ["configure prefix <prefix>", "configure logging mod_action <channel>", "configure mute_role <role>"],
			argList: ["setting:string"],
			minArgs: 1,
			maxArgs: -1,
			clearance: 75,
			userPerms: ["MANAGE_GUILD"],
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		await message.channel.send(
			await this.client.bulbutils.translateNew("event_message_args_missing_list", message.guild?.id, {
				argument: args[0].toLowerCase(),
				arg_expected: "action:string",
				argument_list: "mute_role, prefix, auto_role, timezone, logging, override",
			}),
		);
	}
}
