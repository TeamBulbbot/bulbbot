import { Guild, Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import ExperimentManager from "../../../../utils/managers/ExperimentManager";

const { removeExperimentFromGuild } = new ExperimentManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "remove",
			usage: "remove <guildID> <experiment>",
			minArgs: 2,
			maxArgs: 2,
			argList: ["guildID:Snowflake", "experiment:String"],
			description: "Remove a guild from the experiment",
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		let guild: Guild;

		try {
			guild = await this.client.guilds.fetch(args[0]);
		} catch (_) {
			context.channel.send(`Unable to find a guild with the ID of \`${args[0]}\``);
			return;
		}
		await removeExperimentFromGuild(guild.id, args[1]);

		await context.channel.send(`Removed \`${args[1]}\` from **${guild.name}**`);
	}
}
