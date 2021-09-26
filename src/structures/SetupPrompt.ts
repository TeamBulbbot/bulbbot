import { CollectorFilter, Message, User } from "discord.js";
import { RoleMention, NonDigits } from "src/utils/Regex";
import GuildConfigType from "src/utils/types/GuildConfigType";
import ConfigPart from "../utils/types/ConfigPart";
import BulbBotClient from "./BulbBotClient";
import CommandContext, { getCommandContext } from "./CommandContext";
// import SetupUtils from "../utils/SetupUtils";

export default class SetupPrompt {

	private readonly client: BulbBotClient;
	private readonly context: CommandContext;
	private readonly part: ConfigPart;
	private readonly dbguild: GuildConfigType;

	private readonly partName: keyof typeof ConfigPart;
	private promptText!: string;
	private defaultText!: string;
	private timeoutText!: string;

	public static async PrepareQuestion(client: BulbBotClient, context: CommandContext, part: ConfigPart, dbguild: GuildConfigType): Promise<SetupPrompt> {
		const prompt = new SetupPrompt(client, context, part, dbguild);
		prompt.promptText = await prompt.client.bulbutils.translate(`setup_guild_prompt_${prompt.partName}`, prompt.context.guildId, {});
		prompt.timeoutText = await prompt.client.bulbutils.translate(`setup_guild_prompt_${prompt.partName}_timeout`, prompt.context.guildId, {})
	}

	/**
	 * This constructor should never be invoked directly. Use the `SetupPrompt.PrepareQuestion` factory method instead.
	 * @param client
	 * @param context
	 * @param part
	 * @param dbguild
	 * @private
	 */
	private constructor(client: BulbBotClient, context: CommandContext, part: ConfigPart, dbguild: GuildConfigType) {
		this.client = client;
		this.context = context;
		this.part = part;
		this.dbguild = dbguild;

		// @ts-ignore
		this.partName = ConfigPart[this.part];
	}

	public async ask(): Promise<string | null> {
		let maxtime = 300000;
		await this.context.channel.send({ content: `${this.promptText} (${this.defaultText})`, allowedMentions: { parse: [] } });
		const response = (await this.context.channel.awaitMessages({ filter: this.filter(this.part, this.context.author), max: 1, time: maxtime })).first();
		if (!response) {
			await this.context.channel.send({ content: `${this.timeoutText}`, allowedMentions: { parse: [] } });
			return null;
		}
		if (response.content === this.dbguild.prefix) return this.defaultText;
		return response.content;
	}

	protected _filter(user: User, f: CollectorFilter<[CommandContext]>): CollectorFilter<[Message]> {
		// Only accept messages from the command issuer
		// Replying with just-the-prefix means "use default"/"don't change". The default/current for each setting is in parenthesis after the prompt
		return async (message: Message): Promise<boolean> => message.author.id === user.id && (message.content === this.client.prefix || (await f(await getCommandContext(message))));
	}

	public filter(part: ConfigPart, user: User): CollectorFilter<[Message]> {
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
