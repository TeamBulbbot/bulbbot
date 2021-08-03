import Command from "../../structures/Command";
import { Message } from "discord.js";
import search from "./infraction/search";
import info from "./infraction/info";
import claim from "./infraction/claim";
import update from "./infraction/update";
import modsearch from "./infraction/modsearch";
import offendersearch from "./infraction/offendersearch";
import remove from "./infraction/remove";

export default class extends Command {
	constructor(...args) {
		// @ts-ignore
		super(...args, {
			description: "Infraction Desc",
			category: "Moderation",
			subCommands: [search, info, claim, update, modsearch, offendersearch, remove],
			aliases: ["inf"],
			usage: "!infraction <action>",
			userPerms: ["MANAGE_GUILD"],
			clearance: 50,
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			clientPerms: ["EMBED_LINKS", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
		});
	}

	async run(message: Message, args: string[]): Promise<void | Message> {
		await message.channel.send(
			await this.client.bulbutils.translateNew("event_message_args_missing_list", message.guild?.id, {
				argument: args[0].toLowerCase(),
				arg_expected: "action:string",
				argument_list: "claim, info, modsearch, offendersearch, remove, search, update"
			}),
		);
	}
}
