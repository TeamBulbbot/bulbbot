import { Guild, Message } from "discord.js";
import Command from "../../../../structures/Command";
import SubCommand from "../../../../structures/SubCommand";
import CommandContext from "../../../../structures/CommandContext";
import BulbBotClient from "../../../../structures/BulbBotClient";
import ExperimentManager from "../../../../utils/managers/ExperimentManager";

const { addExperimentToGuild } = new ExperimentManager();

export default class extends SubCommand {
	constructor(client: BulbBotClient, parent: Command) {
		super(client, parent, {
			name: "add",
			usage: "add <guildID> <experiment>",
			minArgs: 2,
			maxArgs: 2,
			argList: ["guildID:Snowflake", "experiment:String"],
			description: "Add a experiment to a guild",
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

		await context.channel.send(`Added \`${args[1]}\` to **${guild.name}**\n\`\`\`json\n${JSON.stringify(await addExperimentToGuild(guild.id, args[1]), null, 2)}\n\`\`\``);
	}
}
