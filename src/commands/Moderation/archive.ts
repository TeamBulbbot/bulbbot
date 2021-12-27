import Command from "../../structures/Command";
import BulbBotClient from "../../structures/BulbBotClient";
import channel from "./archive/channel";
import user from "./archive/user";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Archive commands",
			category: "Moderation",
			subCommands: [channel, user],
			usage: "<action>",
			clearance: 50,
			minArgs: 1,
			maxArgs: -1,
			argList: ["action:string"],
			clientPerms: ["EMBED_LINKS", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"],
		});
	}
}
