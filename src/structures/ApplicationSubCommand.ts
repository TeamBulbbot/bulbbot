import BulbBotClient from "./BulbBotClient";
import { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from "discord-api-types/v10";
import ApplicationCommand from "./ApplicationCommand";
import { CommandInteraction } from "discord.js";

interface ApplicationSubCommandConstructOptions {
	name: string;
	description: string;
	options?: APIApplicationCommandBasicOption[];
}

export default class extends ApplicationCommand {
	public readonly parent: ApplicationCommand;

	constructor(client: BulbBotClient, parent: ApplicationCommand, options: ApplicationSubCommandConstructOptions = { name: "missing name", description: "no description" }) {
		super(client, {
			name: options.name,
			type: ApplicationCommandOptionType.Subcommand,
			description: options.description || parent.description,
			options: options.options as APIApplicationCommandBasicOption[],
		});
		this.parent = parent;
	}

	public async run(_interaction: CommandInteraction): Promise<void> {
		throw new Error("Method not implemented.");
	}
}
