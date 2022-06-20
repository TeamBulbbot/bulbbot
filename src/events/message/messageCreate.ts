import Event from "../../structures/Event";
import { Message, Permissions } from "discord.js";
import Command from "../../structures/Command";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import * as Config from "../../Config";
import LoggingManager from "../../utils/managers/LoggingManager";
import AutoMod from "../../utils/AutoMod";
import ResolveCommandOptions from "../../utils/types/ResolveCommandOptions";
import CommandContext, { getCommandContext } from "../../structures/CommandContext";
import ExperimentManager from "../..//utils/managers/ExperimentManager";
import { commandUsage } from "../../utils/Prometheus";

const databaseManager: DatabaseManager = new DatabaseManager();
const clearanceManager: ClearanceManager = new ClearanceManager();
const loggingManager: LoggingManager = new LoggingManager();
const { getAllGuildExperiments }: ExperimentManager = new ExperimentManager();

export default class extends Event {
	constructor(...args: any[]) {
		// @ts-expect-error
		super(...args, {
			on: true,
		});
	}

	public async run(message: Message): Promise<any> {
		const context = await getCommandContext(message);

		// checks if the user is in the blacklist
		if (this.client.blacklist.get(context.author.id) !== undefined) return;
		if (!context.guild || context.author.bot || !this.client.user?.id) return;

		// checks if the guild is in the blacklist
		if (this.client.blacklist.get(context.guild.id)) return;

		await databaseManager.addToMessageToDB(message);

		const mentionRegex = RegExp(`^<@!?${this.client.user.id}>`);
		let guildCfg = await databaseManager.getConfig(context.guild);

		if ((guildCfg === undefined || guildCfg.prefix === undefined) && (context.content.startsWith(Config.prefix) || mentionRegex.test(context.content))) {
			await databaseManager.deleteGuild(context.guild);
			await databaseManager.getGuild(context.guild);
			if (!(guildCfg = await databaseManager.getConfig(context.guild)))
				return this.safeReply(context, "Please remove and re-add the bot to the server https://bulbbot.rocks/invite, there has been an error with the configuration of the guild");
		}

		const prefix = guildCfg.prefix;
		const premiumGuild = guildCfg.premiumGuild;
		this.client.prefix = prefix;
		context.prefix = prefix;
		const clearance: number = await clearanceManager.getUserClearance(context);

		if (clearance < 25) {
			await AutoMod(this.client, context);
		}

		if (!context.content.startsWith(this.client.prefix) && !context.content.match(mentionRegex)) return;
		if (context.content.match(mentionRegex) && context.content.replace(mentionRegex, "").trim().length === 0)
			return this.safeReply(context, `My prefix for **${context.guild.name}** is \`\`${this.client.prefix}\`\``);
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

		let used = `${prefix}${command.qualifiedName}`;
		options.args.forEach((arg) => (used += ` ${arg}`));
		command.devOnly || command.subDevOnly ? null : await loggingManager.sendCommandLog(this.client, context.guild, context.author, context.channel.id, used);

		const serverOverrides: string[] = await getAllGuildExperiments(context.guild.id);
		commandUsage(context, command, false);

		try {
			if (command.overrides.length > 0) {
				if (serverOverrides.length == 0) {
					await command.run(context, options.args);
					return;
				}
				let foundOverride = false;

				for (const override of serverOverrides) {
					if (command.overrides.includes(override)) {
						await command[`_${command.overrides[command.overrides.indexOf(override)]}`](context, options.args);
						foundOverride = true;
					}
				}
				if (!foundOverride) {
					await command.run(context, options.args);
					return;
				}
			} else {
				await command.run(context, options.args);
				return;
			}
		} catch (err: any) {
			await this.client.bulbutils.logError(err, context);
		}
	}

	private async safeReply(context: CommandContext, text: string): Promise<Message | undefined> {
		if (!context.guild?.me?.permissionsIn(context.channel.id).has(Permissions.FLAGS.SEND_MESSAGES)) return;
		return await context.channel.send(text);
	}

	private async resolveCommand(options: ResolveCommandOptions): Promise<Command | Message | undefined> {
		const { context, baseCommand, args } = options;
		const command = baseCommand;
		if (!context.guild?.me) await this.client.bulbfetch.getGuildMember(context.guild?.members, this.client.user?.id);
		if (!context.guild?.me) return; // Shouldn't be possible to return here. Narrows the type
		const invalidReason = await command.validate(context, args, options);
		if (invalidReason !== undefined) {
			if (!invalidReason) return;
			return this.safeReply(context, invalidReason);
		}
		return command;
	}
}
