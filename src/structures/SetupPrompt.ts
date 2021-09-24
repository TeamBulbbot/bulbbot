// @ts-nocheck

import { CollectorFilter } from "discord.js";
import GuildConfigType from "src/utils/types/GuildConfigType";
import ConfigPart from "../utils/types/ConfigPart";
import BulbBotClient from "./BulbBotClient";
import CommandContext from "./CommandContext";
// import SetupUtils from "../utils/SetupUtils";

export default class {

	private readonly client: BulbBotClient;
	private readonly context: CommandContext;
	private readonly part: ConfigPart;
	private readonly dbguild: GuildConfigType;

	private readonly partName: keyof typeof ConfigPart;

	private readonly filter!: CollectorFilter<[CommandContext]>;


	constructor(client: BulbBotClient, context: CommandContext, part: ConfigPart, dbguild: GuildConfigType) {
		this.client = client;
		this.context = context;
		this.part = part;
		this.dbguild = dbguild;

		this.partName = ConfigPart[this.part];
	}

	public async ask() {
		let maxtime = 300000;
		const ;
		// const defaultText = get defaultText;
		await this.context.channel.send({ content: `${this.client.bulbutils.translate(`setup_guild_prompt_${this.partName}`, this.context.guildId, {})} (${defaultText})`, allowedMentions: { parse: [] } });
		const response = (await context.channel.awaitMessages({ filter: this.filter(part, context.author), max: 1, time: maxtime })).first();
		if (!response) {
			await this.context.channel.send({ content: `${this.client.bulbutils.translate(`setup_guild_prompt_${this.partName}_timeout`, this.context.guildId, {})}`, allowedMentions: { parse: [] } });
			return null;
		}
		if (response.content === guildSetup.prefix) guildSetup[this.partName] = defaultOption;
		else guildSetup[this.partName] = response.content;

		return guildSetup[this.partName];
	}
}
