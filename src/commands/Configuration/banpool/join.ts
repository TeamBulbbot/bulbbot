import Command from "../../../structures/Command";
import SubCommand from "../../../structures/SubCommand";
import CommandContext from "../../../structures/CommandContext";
import { Message } from "discord.js";
import BulbBotClient from "../../../structures/BulbBotClient";
import BanpoolManager from "../../../utils/managers/BanpoolManager";

const { joinBanpool }: BanpoolManager = new BanpoolManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "join",
			minArgs: 1,
			maxArgs: -1,
			argList: ["code:string"],
			usage: "<code>",
			clearance: 100,
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		// todo log in banpool logs (in og and this server) that a serer joined the pool
		const code: string = args[0]
		const invite: any = this.client.banpoolInvites.get(code)

		if(!invite) return context.channel.send("no such invite can exist in this world try again")
		if(invite.guild.id === context.guild?.id) return context.channel.send("m8 why are you joining your own banpool????")
		if(!await joinBanpool(invite, context.guild!?.id)) return context.channel.send("Something went horrible wrong :(")

		context.channel.send("wow pal joined the server you are very pogggers")

		this.client.banpoolInvites.delete(invite.banpool.code)
	}
}
