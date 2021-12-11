import Command from "../../structures/Command";
import CommandContext from "../../structures/CommandContext";
import { AnyId } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Parse out the Discord id from any text",
			category: "Miscellaneous",
			usage: "<text>",
			examples: ["id asdasdasdasdasdas123456789012345678asdasdasd"],
			argList: ["text:Text"],
			minArgs: 1,
			maxArgs: -1,
		});
	}

	async run(context: CommandContext, args: string[]) {
		const ids = args.join(" ").match(AnyId);

		if (!ids) return context.channel.send(await this.client.bulbutils.translate("id_no_found", context.guild?.id, {}));
		context.channel.send(ids.join("\n"));

		return;
	}
}
