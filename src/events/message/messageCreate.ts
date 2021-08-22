import Event from "../../structures/Event";
import { Message } from "discord.js";
import Command from "../../structures/Command";
import DMUtils from "../../utils/DMUtils";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import ClearanceManager from "../../utils/managers/ClearanceManager";
import * as Config from "../../Config";
import LoggingManager from "../../utils/managers/LoggingManager";
import AutoMod from "../../utils/AutoMod";
import ResolveCommandOptions from "src/utils/types/ResolveCommandOptions";

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
		// checks if the user is in the blacklist
		if (this.client.blacklist.get(message.author.id) !== undefined) return;

		if (message.channel.type === "DM") return DMUtils(this.client, message);
		if (!message.guild || message.author.bot) return;

		// checks if the guild is in the blacklist
		if (this.client.blacklist.get(message.guild.id)) return;

		const mentionRegex: RegExp = RegExp(`^<@!?${this.client.user!.id}>`);
		let guildCfg = await databaseManager.getConfig(message.guild.id);

		if ((guildCfg === undefined || guildCfg.prefix === undefined) && (message.content.startsWith(Config.prefix) || mentionRegex.test(message.content))) {
			await databaseManager.deleteGuild(message.guild.id);
			await databaseManager.createGuild(message.guild);
			if (!(guildCfg = await databaseManager.getConfig(message.guild.id)))
				return message.channel.send("Please remove and re-add the bot to the server https://bulbbot.mrphilip.xyz/invite, there has been an error with the configuration of the guild");
		}

		const prefix = guildCfg.prefix;
		const premiumGuild = guildCfg.premiumGuild;
		this.client.prefix = prefix;
		const clearance: number = await clearanceManager.getUserClearance(message);

		if (clearance < 25) {
			await AutoMod(this.client, message);
		}

		if (!message.content.startsWith(this.client.prefix) && !message.content.match(mentionRegex)) return;
		if (message.content.match(mentionRegex) && message.content.replace(mentionRegex, "").trim().length === 0)
			return message.channel.send(`My prefix for **${message.guild.name}** is \`${this.client.prefix}\``);
		if (message.content.match(mentionRegex)) message.content = `${this.client.prefix}${message.content.replace(mentionRegex, "").trim()}`;

		const args = message.content.slice(this.client.prefix.length).trim().split(/ +/g);
		let command: Command | undefined = Command.resolve(this.client, args);

		if (!command) return;

		const options: ResolveCommandOptions = {
			message,
			baseCommand: command,
			args: args.slice(command.qualifiedName.split(" ").length),
			clearance,
			premiumGuild,
			isDev: Config.developers.includes(message.author.id),
			isSubDev: Config.developers.includes(message.author.id) || Config.subDevelopers.includes(message.author.id),
		};

		const resolved = await this.resolveCommand(options);
		if (!resolved) return;
		if (resolved instanceof Message) return resolved;
		command = resolved;

		let used: string = `${prefix}${command.name}`;
		options.args.forEach(arg => (used += ` ${arg}`));
		command.devOnly || command.subDevOnly ? null : await loggingManager.sendCommandLog(this.client, message.guild, message.author, message.channel.id, message.content);

		await command.run(message, options.args);
	}

	private async resolveCommand(options: ResolveCommandOptions): Promise<Command | Message | undefined> {
		const { message, baseCommand, args } = options;
		let command = baseCommand;
		if (!message.guild?.me) await message.guild?.members.fetch(this.client.user!.id);
		if (!message.guild?.me) return; // Shouldn't be possible to return here. Narrows the type
		const invalidReason = await command.validate(message, args, options);
		if (invalidReason !== undefined) {
			if (!invalidReason) return;
			return message.channel.send({
				content: invalidReason,
				allowedMentions: {
					parse: ["everyone", "roles", "users"],
				},
			});
		}
		return command;
	}
}
