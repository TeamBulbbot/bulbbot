import Command from "../../structures/Command";
import { CollectorFilter, Message, User } from "discord.js";
import { NonDigits } from "../../utils/Regex";
import DatabaseManager from "../../utils/managers/DatabaseManager";
import { AutoModConfiguration } from "../../utils/types/AutoModConfiguration";
import { LoggingConfiguration } from "../../utils/types/LoggingConfiguration";
import { ConfigPart } from "../../utils/types/ConfigPart";
import GuildSetup from "../../utils/types/GuildSetup";

const databaseManager: DatabaseManager = new DatabaseManager();

export default class extends Command {
	constructor(...args: any) {
		// @ts-ignore
		super(...args, {
			description: "Configures the bot in your guild",
			category: "Configuration",
			usage: "!setup",
			clearance: 75,
		});
	}

	public async run(message: Message, args: string[]): Promise<void | Message> {
		const guildSetup: GuildSetup = {};
		const dbguild: Record<string, any> = await databaseManager.getConfig(message.guild!.id);
		if(!dbguild) return;
		guildSetup.prefix = dbguild.prefix;
		const amc: AutoModConfiguration = await databaseManager.getAutoModConfig(message.guild!.id);
		const lgc: LoggingConfiguration = await databaseManager.getLoggingConfig(message.guild!.id);

		const amEnabled: boolean = amc.enabled;
		const lgEnabled: boolean = lgc && !!(lgc.automod || lgc.channel || lgc.invite || lgc.joinLeave || lgc.joinLeave || lgc.member || lgc.message || lgc.modAction || lgc.other || lgc.role);

		// Need translation. All the prompts can be static, so maybe return them as an object? like bulbbutils.translateGroup("setupPrompts"); or something
		await message.channel.send("Welcome to **Bulbbot Setup**.");
		this.client.bulbutils.sleep(1500);


		// TODO: Language should be prompted first. A GTranslate-friendly prompt for the default may be a good idea
		// This language then be used for translation of all remaining prompts
		if(!this.prompt(message, ConfigPart.language, `Select language. (${dbguild.language})`, guildSetup)) return;


		// Explain what parenthesis at end of prompts mean, how to use
		// This is after language to benefit from translation
		await message.channel.send(`The answer in parenthesis at the end of prompts will be used if you respond to a prompt with your prefix (currently \`${dbguild.prefix}\`)`);

		// TODO remove this ts-ignore later
		// @ts-ignore
		let result: string | null;

		if((result = await this.prompt(message, ConfigPart.prefix,   `Please choose your server prefix. (\`${dbguild.prefix}\`)`, guildSetup,)) === null) return;
		this.client.prefix = guildSetup.prefix!;

		if((result = await this.prompt(message, ConfigPart.timezone, `What is your timezone? (\`${dbguild.timezone}\`)`, guildSetup,)) === null) return;

		if((result = await this.prompt(message, ConfigPart.muterole, `Choose a role to use for muting members. (\`${dbguild.muteRole || "Create one for me"}\`)`, guildSetup,)) === null) return;

		if((result = await this.prompt(message, ConfigPart.automod,  !amEnabled ? `Would you like to enable Bulbbot Automod? (\`Yes\`)` : `Review Automod configuration? (\`No\`)`, guildSetup,)) === null) return;
		/* TODO
			If "yes", delegate to automod guided setup, then proceed
			If "no", proceed
		*/

		if((result = await this.prompt(message, ConfigPart.logging,  !lgEnabled ? `Would you like to set up logging? (\`Yes\`)` : `Review logging configuration? (\`No\`)`, guildSetup,)) === null) return;
		/* TODO
			If "yes", delegate to automod guided setup, then proceed
			If "no", proceed
		*/

		if((result = await this.prompt(message, ConfigPart.autorole, `Would you like to set an auto-role to be added when new members join the server? (\`${dbguild.autorole || "Disable"}\`)`, guildSetup,)) === null) return;


		// Maybe need a copy of this in this.timedout() too
		if(guildSetup.language === dbguild.language) delete guildSetup.language;
		if(guildSetup.prefix === dbguild.prefix) delete guildSetup.prefix;
		if(guildSetup.timezone === dbguild.timezone) delete guildSetup.timezone;
		if(guildSetup.muterole === dbguild.muterole) delete guildSetup.muterole;
		if(guildSetup.automod === "no") delete guildSetup.automod;
		if(guildSetup.logging === "no") delete guildSetup.logging;
		if(guildSetup.autorole === dbguild.autorole) delete guildSetup.autorole;
	}

	public async prompt(message: Message, part: ConfigPart, text: string, guildSetup: GuildSetup, maxtime: number = 180000): Promise<string | null> {
		if(maxtime < 1000) maxtime *= 60000; // Permit timeout in minutes
		const partName: string = Object.getOwnPropertyNames(ConfigPart).find(n => ConfigPart[n] === part)!;
		await message.channel.send(text);
		const response = (await message.channel.awaitMessages(this.filter(part, message.author), { max: 1, time: maxtime })).first();
		if(!response) {await this.timedout(part, message, guildSetup); return null;}
		if(response.content !== guildSetup.prefix) guildSetup[partName] = response.content;

		// Success message? e.g. "Prefix set to `bulb!`"

		return response.content;
	}

	public async applySetup(message: Message, guildSetup: GuildSetup | undefined) {
		if(!guildSetup || guildSetup === {}) return;

		// Maybe display !settings at the end?

		// If there were a method in DatabaseManager to batch these changes, that would probably
		// be optimal

		if(guildSetup.language)
			await databaseManager.setLanguage(message.guild!.id, guildSetup.language);

		if(guildSetup.prefix) //{
			await databaseManager.setPrefix(message.guild!.id, guildSetup.prefix);
			//message.channel.send(await this.client.bulbutils.translate("config_prefix_success", message.guild?.id, { prefix: guildSetup.prefix }));
		//}

		if(guildSetup.timezone)
			await databaseManager.setTimezone(message.guild!.id, guildSetup.timezone);


		if(guildSetup.muterole)
			databaseManager.setMuteRole(message.guild!.id, guildSetup.muterole);


		if(guildSetup.automod) {
			// TODO
			// take care of this in automod guided and noop here,
			// or do all changes here to make future batching easier?
		}


		if(guildSetup.logging) {
			// TODO
			// same as automod
		}

		if(guildSetup.autorole)
			databaseManager.setAutoRole(message.guild!.id, guildSetup.autorole);

	}

	private async timedout(part: ConfigPart, message: Message, partialSetup: GuildSetup | undefined = {}) {
		// TODO
		// THESE ARE PLACEHOLDERS
		// WE NEED ACTUAL STUFF HERE BEFORE WE SHIP
		// PLS
		// Perhaps we just accept default action on timeout, another option. Maybe circumstantial
		switch (part) {
			case ConfigPart.language:
				await message.channel.send("Setup language timed out or something");
				break;
			case ConfigPart.prefix:
				await message.channel.send("Setup prefix timed out or something");
				break;
			case ConfigPart.timezone:
				await message.channel.send("Setup timezone timed out or something");
				break;
			case ConfigPart.muterole:
				await message.channel.send("Setup muterole timed out or something");
				break;
			case ConfigPart.automod:
				await message.channel.send("Setup automod timed out or something");
				break;
			case ConfigPart.logging:
				await message.channel.send("Setup logging timed out or something");
				break;
			case ConfigPart.autorole:
				await message.channel.send("Setup autorole timed out or something");
				break;
		};
		this.applySetup(message, partialSetup);
	}

	private _filter(user: User, f: CollectorFilter): CollectorFilter {
		// Only accept messages from the command issuer
		// Replying with just-the-prefix means "use default"/"don't change". The default/current for each setting is in parenthesis after the prompt
		return async (message: Message): Promise<boolean> => message.author.id === user.id && (message.content === this.client.prefix || await f(message));
	}

	private filter(part: ConfigPart, user: User): CollectorFilter {
		switch (part) {
			case ConfigPart.language:
				return this._filter(user, async (message: Message): Promise<boolean> => {
					if(!this.client.bulbutils.languages[message.content]) {
						await message.channel.send(
							await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
								arg: message.content,
								arg_expected: "language:string",
								usage: "!configure language <language>",
							})
						);
						return false;
					}

					return true;
				});
			case ConfigPart.prefix:
				return this._filter(user, async (message: Message): Promise<boolean> => {
					if(message.content.length > 255) {
						await message.channel.send(await this.client.bulbutils.translate("config_prefix_too_long", message.guild?.id));
						return false;
					}

					return true;
				});
			case ConfigPart.timezone:
				return this._filter(user, async (message: Message): Promise<boolean> => {
					if(!this.client.bulbutils.timezones[message.content]) {
						await message.channel.send(
							await this.client.bulbutils.translate("event_message_args_unexpected_list", message.guild?.id, {
								arg: message.content,
								arg_expected: "timezone:string",
								usage: "!configure timezone <timezone>",
							})
						);
						return false;
					}

					return true;
				});
			case ConfigPart.muterole:
				return this._filter(user, async (message: Message): Promise<boolean> => {
					if (message.content.toLowerCase() !== "remove" && message.content.toLowerCase() !== "create one for me") {
						const role: string = message.content.replace(NonDigits, "");
						const rTemp = message.guild?.roles.cache.get(role);
						if (rTemp === undefined
						||  message.guild?.me?.roles.highest && message.guild.me.roles.highest.rawPosition < rTemp.rawPosition) {
							await message.channel.send(
								await this.client.bulbutils.translate("global_role_not_found", message.guild?.id, {
									arg_provided: role,
									arg_expected: "role:Role",
									usage: "!configure mute_role <role>",
								}),
							);
							return false;
						}
					}

					return true;
				});
			case ConfigPart.automod:
			case ConfigPart.logging:
				return this._filter(user, async (message: Message): Promise<boolean> => {
					switch(message.content.toLowerCase())
					{
						case "enable": // Opportunity for localization here
						case "yes":
						case "y":
							message.content = "y";
							return true;
						case "disable":
						case "no":
						case "n":
							message.content = "n";
							return true;
					}

					return false;
				});
			case ConfigPart.autorole:
				return this._filter(user, async (message: Message): Promise<boolean> => {
					if (message.content.toLowerCase() !== "disable") {
						const role = message.guild?.roles.cache.get(message.content.replace(NonDigits, ""));
						if (role === undefined) {
							await message.channel.send(await this.client.bulbutils.translate("config_mute_invalid_role", message.guild?.id));
							return false;
						}
						if (message.guild?.me?.roles.highest && message.guild.me.roles.highest.rawPosition < role.rawPosition) {
							await message.channel.send(await this.client.bulbutils.translate("config_mute_unable_to_manage", message.guild.id));
							return false;
						}
					}

					return true;
				});
			default: throw Error(); // Avoid garbled output and bad DB writes if something ain't right
		};
	}
}
