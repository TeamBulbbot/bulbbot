import { Guild, Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import ExperimentManager from "../../../../utils/managers/ExperimentManager";

const { getAllGuildExperiments } = new ExperimentManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "info",
			usage: "info <guildID>",
			aliases: ["check"],
			minArgs: 1,
			maxArgs: 1,
			argList: ["guildID:snowflake"],
			description: "Get list of experiments a guild has access to",
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

		const experiments = await getAllGuildExperiments(guild.id);
		await context.channel.send(`**${guild.name}** has access to ${experiments.map((e: any) => `\`${e}\``).join(" ")}`);
	}
}
