import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";
const { doesbanpoolExist, createBanpool, joinBanpool }: BanpoolManager = new BanpoolManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "create",
			minArgs: 1,
			maxArgs: -1,
			argList: ["pool name:string"],
			usage: "<pool name>",
			clearance: 100,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// todo log creation in banpool logs

		const name: string = args[0];

		if (await doesbanpoolExist(name)) return context.channel.send("naw pal that name is already taken sorry");

		await createBanpool(context.guild!?.id, name);
		!(await joinBanpool(
			{
				banpool: {
					name,
				},
			},
			context.guild!?.id,
		));
		context.channel.send("wow pal crated a pog new banpool with the name of " + name);
	}
}
