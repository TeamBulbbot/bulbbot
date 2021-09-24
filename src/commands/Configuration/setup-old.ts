// @ts-nocheck
import automod from "./setup/automod";
import logging from "./setup/logging";

import Command from "../../structures/Command";
import { CollectorFilter, Message, User } from "discord.js";
import { NonDigits, RoleMention } from "../../utils/Regex";
import BulbBotClient from "../../structures/BulbBotClient";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import AutoModConfiguration from "../../utils/types/AutoModConfiguration";
import LoggingConfiguration from "../../utils/types/LoggingConfiguration";
import ConfigPart from "../../utils/types/ConfigPart";
import GuildSetup from "../../utils/types/GuildSetup";
import AutoModSetup from "../../utils/types/AutoModSetup";
import CommandContext, { getCommandContext } from "../../structures/CommandContext";

const databaseManager: DatabaseManager = new DatabaseManager();

/** @internal */
export interface PromptOptions {
	defaultText?: string;
	maxtime?: number;
}

export default class extends Command {
	constructor(client: BulbBotClient, name: string) {
		super(client, {
			name,
			description: "Configures the bot in your guild",
			category: "Configuration",
			subCommands: [
				/*automod, logging*/
			],
			usage: "[part]",
			clearance: 75,
			maxArgs: 1,
			devOnly: true, // command still WIP
		});
	}

	public async run(context: CommandContext, args: string[]): Promise<void | Message> {
		const guildSetup: GuildSetup = {};
		const dbguild: Record<string, any> = await databaseManager.getConfig(context.guild!.id);
		if (!dbguild) return;
		guildSetup.prefix = dbguild.prefix;
		const amc: AutoModConfiguration = await databaseManager.getAutoModConfig(context.guild!.id);
		const lgc: LoggingConfiguration = await databaseManager.getLoggingConfig(context.guild!.id);

		const amEnabled: boolean = amc.enabled;
		const lgEnabled: boolean = lgc && !!(lgc.automod || lgc.channel || lgc.invite || lgc.joinLeave || lgc.joinLeave || lgc.member || lgc.message || lgc.modAction || lgc.other || lgc.role);

		// TODO remove this ts-ignore later
		// @ts-ignore
		let result: string | null;

		// Need translation. All the prompts can be static, so maybe return them as an object? like bulbbutils.translateGroup("setupPrompts"); or something
		await context.channel.send("Welcome to **Bulbbot Setup**.");
		await this.client.bulbutils.sleep(1000);

		// TODO: Language should be prompted first. A GTranslate-friendly prompt for the default may be a good idea
		// This language then be used for translation of all remaining prompts
		if ((result = await this.prompt(context, ConfigPart.language, `Select language.`, dbguild.language, guildSetup)) === null) return;
		// Access `guildSetup.language` for translation lang

		// Explain what parenthesis at end of prompts mean, how to use
		// This is after language to benefit from translation
		//await context.channel.send(`The answer in parenthesis at the end of prompts will be used if you respond to a prompt with your prefix (currently \`${dbguild.prefix}\`)`);

		if (
			(result = await this.prompt(
				context,
				ConfigPart.prefix,
				`The answer in parenthesis at the end of prompts will be used if you respond to a prompt with your prefix (currently \`${dbguild.prefix}\`)\n\nPlease choose your server prefix.`,
				dbguild.prefix,
				guildSetup,
			)) === null
		)
			return;
		this.client.prefix = guildSetup.prefix!;

		if ((result = await this.prompt(context, ConfigPart.timezone, `What is your timezone?`, dbguild.timezone, guildSetup)) === null) return;
		guildSetup.timezone = result.toUpperCase();

		const muteroleCandidate: string = context.guild?.roles.cache.find(role => role.name === "Muted")?.id || dbguild.muterole || "Create one for me";
		if (
			(result = await this.prompt(context, ConfigPart.muteRole, `Choose a role to use for muting members.`, muteroleCandidate, guildSetup, {
				defaultText: NonDigits.test(muteroleCandidate) ? muteroleCandidate : `<@&${muteroleCandidate}>`,
			})) === null
		)
			return;
		if (!dbguild.muterole && result.toLowerCase() === "remove") guildSetup.muterole = dbguild.muterole;
		else if (result.toLowerCase() === "disable") guildSetup.muterole = null;
		else if (result.toLowerCase() !== "create one for me") guildSetup.muterole = result.replace(NonDigits, "");

		if (
			(result = await this.prompt(context, ConfigPart.automod, !amEnabled ? `Would you like to enable Bulbbot Automod?` : `Review Automod configuration?`, !amEnabled ? "Yes" : "No", guildSetup)) ===
			null
		)
			return;
		/* TODO
			If "yes", delegate to automod guided setup, then proceed
			If "no", proceed
		*/
		if (guildSetup.automod === "yes") {
			const amSetup = new automod(this.client, this);
			guildSetup.automod_settings = <AutoModSetup>await amSetup.run(context, [guildSetup.prefix!]);
			if (guildSetup.automod_settings === null) return;
		}

		if ((result = await this.prompt(context, ConfigPart.logging, !lgEnabled ? `Would you like to set up logging?` : `Review logging configuration?`, !lgEnabled ? "Yes" : "No", guildSetup)) === null)
			return;
		/* TODO
			If "yes", delegate to logging guided setup, then proceed
			If "no", proceed
		*/

		const autoroleCandidate = dbguild.autorole || "Disable";
		if (
			(result = await this.prompt(context, ConfigPart.autorole, `Would you like to set an auto-role to be added when new members join the server?`, autoroleCandidate, guildSetup, {
				defaultText: NonDigits.test(autoroleCandidate) ? autoroleCandidate : `<@&${autoroleCandidate}>`,
			})) === null
		)
			return;
		if (!dbguild.autorole && result.toLowerCase() === "disable") guildSetup.autorole = dbguild.autorole;
		else if (result.toLowerCase() === "disable") guildSetup.autorole = null;
		else guildSetup.autorole = result.replace(NonDigits, "");

		await this.applySetup(context, guildSetup);
	}

	public async prompt(context: CommandContext, part: ConfigPart, text: string, defaultOption: string, guildSetup: GuildSetup, options: PromptOptions = {}): Promise<string | null> {
		let maxtime = options.maxtime ?? 180000;
		if (maxtime < 1000) maxtime *= 60000; // Permit maxtime in minutes
		const partName: string = Object.getOwnPropertyNames(ConfigPart).find(n => ConfigPart[n] === part)!;
		const defaultText = options.defaultText ?? `\`${defaultOption}\``;
		await context.channel.send({ content: `${text} (${defaultText})`, allowedMentions: { parse: [] } });
		const response = (await context.channel.awaitMessages({ filter: this.filter(part, context.author), max: 1, time: maxtime })).first();
		if (!response) {
			await this.timedout(part, context, guildSetup);
			return null;
		}
		if (response.content === guildSetup.prefix) guildSetup[partName] = defaultOption;
		else guildSetup[partName] = response.content;

		// Should each prompt send a success/confirmation context? e.g. "Prefix set to `bulb!`"

		return guildSetup[partName];
	}

	public async applySetup(context: CommandContext, guildSetup: GuildSetup | undefined) {
		if (!guildSetup || guildSetup === {}) return;

		const dbguild: Record<string, any> = await databaseManager.getConfig(context.guild!.id);
		if (guildSetup.language === dbguild.language) delete guildSetup.language;
		if (guildSetup.prefix === dbguild.prefix) delete guildSetup.prefix;
		if (guildSetup.timezone === dbguild.timezone) delete guildSetup.timezone;
		if (guildSetup.muterole === dbguild.muterole) delete guildSetup.muterole;
		if (guildSetup.automod === "no") delete guildSetup.automod;
		if (guildSetup.logging === "no") delete guildSetup.logging;
		if (guildSetup.autorole === dbguild.autorole) delete guildSetup.autorole;

		// If there were a single method in DatabaseManager to batch these changes, that
		// would probably be optimal

		if (guildSetup.language) await databaseManager.setLanguage(context.guild!.id, guildSetup.language);

		if (guildSetup.prefix)
			//{
			await databaseManager.setPrefix(context.guild!.id, guildSetup.prefix);
		//context.channel.send(await this.client.bulbutils.translate("config_prefix_success", context.guild?.id, { prefix: guildSetup.prefix }));
		//}

		if (guildSetup.timezone) await databaseManager.setTimezone(context.guild!.id, guildSetup.timezone);

		if (guildSetup.muterole !== undefined) {
			if (guildSetup.muterole?.toLowerCase() === "create one for me") {
				guildSetup.muterole = await context
					.guild!.roles.create({
						name: "Muted", // op: Localization
						permissions: undefined,
						color: 0x808080, // Grayish?
					})
					.then(r => r.id)
					.catch(_ => null);
			}
			await databaseManager.setMuteRole(context.guild!.id, guildSetup.muterole);
		}

		if (guildSetup.automod) {
			// TODO
			// take care of this in automod guided and noop here,
			// or do all changes here to make future batching easier?
		}

		if (guildSetup.logging) {
			// TODO
			// same as automod
		}

		if (guildSetup.autorole !== undefined) {
			await databaseManager.setAutoRole(context.guild!.id, guildSetup.autorole);
		}

		await context.channel.send("Setup complete"); // op: localization
		await this.client.commands.get("settings")?.run(context, []);
	}

	private async timedout(part: ConfigPart, context: CommandContext, partialSetup: GuildSetup | undefined = {}) {
		// TODO
		// THESE ARE PLACEHOLDERS
		// WE NEED ACTUAL STUFF HERE BEFORE WE SHIP
		// PLS
		// Perhaps we just accept default action on timeout, another option. Maybe circumstantial
		switch (part) {
			case ConfigPart.language:
				await context.channel.send("Setup language timed out or something");
				break;
			case ConfigPart.prefix:
				await context.channel.send("Setup prefix timed out or something");
				break;
			case ConfigPart.timezone:
				await context.channel.send("Setup timezone timed out or something");
				break;
			case ConfigPart.muteRole:
				await context.channel.send("Setup muterole timed out or something");
				break;
			case ConfigPart.automod:
				await context.channel.send("Setup automod timed out or something");
				break;
			case ConfigPart.logging:
				await context.channel.send("Setup logging timed out or something");
				break;
			case ConfigPart.autorole:
				await context.channel.send("Setup autorole timed out or something");
				break;
		}
		await this.applySetup(context, partialSetup);
	}

	// note from philip, Idk what the CollectorFilter wants :shrug:
	/** @internal */
	public _filter(user: User, f: CollectorFilter<[CommandContext]>): CollectorFilter<[Message]> {
		// Only accept contexts from the command issuer
		// Replying with just-the-prefix means "use default"/"don't change". The default/current for each setting is in parenthesis after the prompt
		return async (context: Message): Promise<boolean> => context.author.id === user.id && (context.content === this.client.prefix || (await f(await getCommandContext(context))));
	}

	private filter(part: ConfigPart, user: User): CollectorFilter<[Message]> {
		switch (part) {
			case ConfigPart.language:
				return this._filter(user, async (context: CommandContext): Promise<boolean> => {
					if (!this.client.bulbutils.languages[context.content]) {
						await context.channel.send(
							await this.client.bulbutils.translate("event_message_args_unexpected", context.guild?.id, {
								argument: context.content,
								arg_expected: "language:string",
								arg_provided: context.content,
								usage: "configure language <language>",
							}),
						);
						return false;
					}

					return true;
				});
			case ConfigPart.prefix:
				return this._filter(user, async (context: CommandContext): Promise<boolean> => {
					if (context.content.length > 255) {
						await context.channel.send(await this.client.bulbutils.translate("config_prefix_too_long", context.guild?.id, {}));
						return false;
					}

					return true;
				});
			case ConfigPart.timezone:
				return this._filter(user, async (context: CommandContext): Promise<boolean> => {
					if (!this.client.bulbutils.timezones[context.content.toUpperCase()]) {
						await context.channel.send(
							await this.client.bulbutils.translate("event_message_args_unexpected", context.guild?.id, {
								argument: context.content,
								arg_expected: "timezone:string",
								arg_provided: context.content,
								usage: "configure timezone <timezone>",
							}),
						);
						return false;
					}

					return true;
				});
			case ConfigPart.muteRole:
				return this._filter(user, async (context: CommandContext): Promise<boolean> => {
					if (context.content.toLowerCase() !== "remove" && context.content.toLowerCase() !== "create one for me") {
						const role: string = RoleMention.test(context.content) ? context.content.replace(NonDigits, "") : context.content;
						const rTemp = context.guild?.roles.cache.get(role);
						if (rTemp === undefined || (context.guild?.me?.roles.highest && context.guild.me.roles.highest.rawPosition < rTemp.rawPosition)) {
							await context.channel.send(
								await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
									type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
									arg_provided: role,
									arg_expected: "role:Role",
									usage: "configure mute_role <role>",
								}),
							);
							return false;
						}
					}

					return true;
				});
			case ConfigPart.automod:
			case ConfigPart.logging:
				return this._filter(user, async (context: CommandContext): Promise<boolean> => {
					switch (context.content.toLowerCase()) {
						case "enable": // Opportunity for localization here
						case "yes":
						case "y":
							context.content = "yes";
							return true;
						case "disable":
						case "no":
						case "n":
							context.content = "no";
							return true;
					}

					return false;
				});
			case ConfigPart.autorole:
				return this._filter(user, async (context: CommandContext): Promise<boolean> => {
					switch (context.content.toLowerCase()) {
						case "disable":
						case "no":
						case "n":
							return true;
						default:
							const role = context.guild?.roles.cache.get(RoleMention.test(context.content) ? context.content.replace(NonDigits, "") : context.content);
							if (role === undefined) {
								await context.channel.send(
									await this.client.bulbutils.translate("global_not_found", context.guild?.id, {
										type: await this.client.bulbutils.translate("global_not_found_types.role", context.guild?.id, {}),
										arg_expected: "role:Role",
										arg_provided: context.content,
										usage: "configure auto_role <role>",
									}),
								);
								return false;
							}
							if (context.guild?.me?.roles.highest && context.guild.me.roles.highest.rawPosition < role.rawPosition) {
								await context.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage", context.guild.id, {}));
								return false;
							}
							return true;
					}
				});
			default:
				throw Error(); // Avoid garbled output and bad DB writes if something ain't right
		}
	}
}
