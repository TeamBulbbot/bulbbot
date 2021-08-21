import Event from "../../structures/Event";
import { Message } from "discord.js";
import Command from "../../structures/Command";
import DMUtils from "../../utils/DMUtils";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import * as Config from "../../Config";
import LoggingManager from "../../utils/managers/LoggingManager";
import AutoMod from "../../utils/AutoMod";
import ResolveCommandOptions from "../../utils/types/ResolveCommandOptions";
import { getCommandContext } from "../../structures/CommandContext";

const databaseManager: DatabaseManager = new DatabaseManager();
const clearanceManager: ClearanceManager = new ClearanceManager();
const loggingManager: LoggingManager = new LoggingManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-ignore
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<any> {
		const context = await getCommandContext(message);
		// checks if the user is in the blacklist
		if (this.client.blacklist.get(context.author.id) !== undefined) return;

		if (context.channel.type === "DM") return DMUtils(this.client, context);
		if (!context.guild || context.author.bot) return;

		// checks if the guild is in the blacklist
		if (this.client.blacklist.get(context.guild.id)) return;

		const mentionRegex: RegExp = RegExp(`^<@!?${this.client.user!.id}>`);
		let guildCfg = await databaseManager.getConfig(context.guild.id);

		if ((guildCfg === undefined || guildCfg.prefix === undefined) && (context.content.startsWith(Config.prefix) || mentionRegex.test(context.content))) {
			await databaseManager.deleteGuild(context.guild.id);
			await databaseManager.createGuild(context.guild);
			if (!(guildCfg = await databaseManager.getConfig(context.guild.id)))
				return context.channel.send("Please remove and re-add the bot to the server https://bulbbot.mrphilip.xyz/invite, there has been an error with the configuration of the guild");
		}

		const prefix = guildCfg.prefix;
		const premiumGuild = guildCfg.premiumGuild;
		this.client.prefix = prefix;
		const clearance: number = await clearanceManager.getUserClearance(context);

		if (clearance < 25) {
			await AutoMod(this.client, context);
		}

		if (!context.content.startsWith(this.client.prefix) && !context.content.match(mentionRegex)) return;
		if (context.content.match(mentionRegex) && context.content.replace(mentionRegex, "").trim().length === 0)
			return context.channel.send(`My prefix for **${context.guild.name}** is \`\`${this.client.prefix}\`\``);
		if (context.content.match(mentionRegex)) context.content = `${this.client.prefix}${context.content.replace(mentionRegex, "").trim()}`;

		const args = context.content.slice(this.client.prefix.length).trim().split(/ +/g);
		let command: Command | undefined = Command.resolve(this.client, args);

		if (!command) return;

		const options: ResolveCommandOptions = {
			context: context,
			baseCommand: command,
			args: args.slice(command.qualifiedName.split(" ").length),
			clearance,
			premiumGuild,
			isDev: Config.developers.includes(context.author.id),
			isSubDev: Config.developers.includes(context.author.id) || Config.subDevelopers.includes(context.author.id),
		};

		const resolved = await this.resolveCommand(options);
		if (!resolved) return;
		if (resolved instanceof Message) return resolved;
		command = resolved;

		let used: string = `${prefix}${command.name}`;
		options.args.forEach(arg => (used += ` ${arg}`));
		command.devOnly || command.subDevOnly ? null : await loggingManager.sendCommandLog(this.client, context.guild, context.author, context.channel.id, used);

		await command.run(context, options.args);
	}

	private async resolveCommand(options: ResolveCommandOptions): Promise<Command | Message | undefined> {
		const { context, baseCommand, args } = options;
		let command = baseCommand;
		if (!context.guild?.me) await context.guild?.members.fetch(this.client.user!.id);
		if (!context.guild?.me) return; // Shouldn't be possible to return here. Narrows the type
		const invalidReason = await command.validate(context, args, options);
		if (invalidReason !== undefined) {
			if (!invalidReason) return;
			return context.channel.send(invalidReason);
		}
		return command;
	}
}
