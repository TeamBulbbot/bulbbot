import { APIInteractionGuildMember, APIUser, APIMessage, APIMessageComponent, APIActionRowComponent, MessageType as APIMessageType } from "discord-api-types";
import { ApplicationCommand, ApplicationCommandType, AwaitMessageComponentOptions, AwaitReactionsOptions, Client, ClientApplication, Collection, CommandInteraction, CommandInteractionOptionResolver, EmojiIdentifierResolvable, Guild, GuildMember, GuildResolvable, Interaction, InteractionCollector, InteractionCollectorOptions, InteractionDeferReplyOptions, InteractionDeferUpdateOptions, InteractionReplyOptions, InteractionType, InteractionUpdateOptions, InteractionWebhook, Message, MessageActionRow, MessageActionRowComponent, MessageActivity, MessageAttachment, MessageComponentInteraction, MessageComponentType, MessageEditOptions, MessageEmbed, MessageFlags, MessageInteraction, MessageMentions, MessagePayload, MessageReaction, MessageReference, ReactionCollector, ReactionCollectorOptions, ReactionManager, ReplyMessageOptions, SelectMenuInteraction, Snowflake, StartThreadOptions, Sticker, TextBasedChannels, ThreadChannel, ThreadCreateOptions, User, Webhook, WebhookEditMessageOptions, MessageOptions, MessageType } from "discord.js";


abstract class BaseCommandContext {
	// CommandContext
	public readonly source!: Message | Interaction;
	public readonly contextType!: "message" | "interaction";
	public contextReady!: boolean;

	// Common properties
	public readonly client!: Client;
	public readonly channel!: TextBasedChannels;
	public channelId!: Snowflake;
	public readonly guild!: Guild | null;
	public guildId!: Snowflake | null;
	public readonly createdAt!: Date;
	public readonly createdTimestamp!: number;
	public id!: Snowflake;
	public member!: GuildMember | null;
	public applicationId!: Snowflake | null;

	// Interaction
	public readonly token!: string | null;
	public type!: InteractionType | MessageType;
	public version!: number | null;

	// Message
	public activity!: MessageActivity | null;
	public attachments!: Collection<Snowflake, MessageAttachment>;
	public readonly cleanContent!: string;
	public components!: MessageActionRow[];
	public content!: string;
	public readonly crosspostable!: boolean;
	public readonly deletable!: boolean;
	public deleted!: boolean;
	public readonly editable!: boolean;
	public readonly editedAt!: Date | null;
	public editedTimestamp!: number | null;
	public embeds!: MessageEmbed[];
	public groupActivityApplication!: ClientApplication | null;
	public readonly hasThread!: boolean;
	public interaction!: MessageInteraction | null;
	public mentions!: MessageMentions;
	public nonce!: string | number | null;
	public readonly partial!: false;
	public readonly pinnable!: boolean;
	public pinned!: boolean;
	public reactions!: ReactionManager;
	public stickers!: Collection<Snowflake, Sticker>;
	public system!: boolean;
	public readonly thread!: ThreadChannel | null;
	public tts!: boolean;
	public readonly url!: string | null;
	public webhookId!: Snowflake | null;
	public flags!: Readonly<MessageFlags>;
	public reference!: MessageReference | null;


	// BaseCommandInteraction
	public readonly command!: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
	public commandId!: Snowflake | null;
	public commandName!: string | null;
	public deferred!: boolean;
	public ephemeral!: boolean | null;
	public replied!: boolean;
	public webhook!: InteractionWebhook | null;

	// CommandInteraction
	public options!: CommandInteractionOptionResolver;

	// ContextMenuInteraction
	public targetId!: Snowflake | null;
	public targetType!: Exclude<ApplicationCommandType, 'CHAT_INPUT'> | null;

	// MessageComponentInteraction
	public readonly component!: MessageActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent> | null;
	public componentType!: MessageComponentType | null;
	public message!: Message | APIMessage;
	public customId!: string | null;

	// SelectMenuInteraction
	public values!: string[];

	// getters/setters for user/author to underlying _user property
	public abstract get user(): User;
	public abstract set user(user: User);
	public abstract get author(): User;
	public abstract set author(author: User);


	// Methods
	public abstract toJSON(): unknown;

	// Interaction
	public abstract isButton(): boolean;
	public abstract isCommand(): boolean;
	public abstract isContextMenu(): boolean;
	public abstract isMessageComponent(): boolean;
	public abstract isSelectMenu(): boolean;
	public abstract inGuild(): boolean;

	// Common-ish
	public abstract reply(options: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions): Promise<void | Message | never>;
	public abstract startThread<T>(options: StartThreadOptions | ThreadCreateOptions<T>): Promise<ThreadChannel | never>;

	// Message
	public abstract awaitMessageComponent<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: AwaitMessageComponentOptions<T>,
	): Promise<T>;
	public abstract awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>>;
	public abstract createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector;
	public abstract createMessageComponentCollector<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: InteractionCollectorOptions<T>,
	): InteractionCollector<T>;
	public abstract delete(): Promise<Message>;
	public abstract edit(content: string | MessageEditOptions | MessagePayload): Promise<Message>;
	public abstract equals(message: Message, rawData: unknown): boolean;
	public abstract fetchReference(): Promise<Message>;
	public abstract fetchWebhook(): Promise<Webhook>;
	public abstract crosspost(): Promise<Message>;
	public abstract fetch(force?: boolean): Promise<Message>;
	public abstract pin(): Promise<Message>;
	public abstract react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction>;
	public abstract removeAttachments(): Promise<Message>;
	public abstract suppressEmbeds(suppress?: boolean): Promise<Message>;
	public abstract unpin(): Promise<Message>;

	// MessageComponentInteraction
	public abstract deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public abstract deferReply(options?: InteractionDeferReplyOptions & { fetchReply: any | void }): Promise<void>;
	public abstract deferReply(options?: InteractionDeferReplyOptions): Promise<void | Message | APIMessage>;
	public abstract deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public abstract deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: any | void }): Promise<void>;
	public abstract deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void | Message | APIMessage>;
	public abstract deleteReply(): Promise<void>;
	public abstract editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<Message | APIMessage>;
	public abstract fetchReply(): Promise<Message | APIMessage>;
	public abstract followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage>;
	public abstract update(options: InteractionUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public abstract update(options: InteractionUpdateOptions & { fetchReply: any | void }): Promise<void>;
	public abstract update(options: string | MessagePayload | InteractionUpdateOptions): Promise<void | Message | APIMessage>;

	static async makeMember(client: Client, member: GuildMember | APIInteractionGuildMember | User, guild: Guild | null) {
		if(member instanceof GuildMember) return member;
		if(guild === null) return null;
		if(member instanceof User) {
			try {
				return await guild.members.fetch(member);
			} catch(_) {
				return null;
			}
		}
		return new GuildMember(client, member, guild);
	}

	isMessageContext(): this is MessageCommandContext {
		return this instanceof MessageCommandContext;
	}

	isInteractionContext(): this is InteractionCommandContext {
		return this instanceof InteractionCommandContext;
	}
}

class MessageCommandContext implements BaseCommandContext {
	// CommandContext
	public readonly source: Message;
	public readonly contextType: "message";
	public contextReady: boolean;

	// Common properties
	public readonly client: Client;
	public readonly channel: TextBasedChannels;
	public channelId: Snowflake;
	public readonly guild: Guild | null;
	public guildId: Snowflake | null;
	public readonly createdAt: Date;
	public readonly createdTimestamp: number;
	public id: Snowflake;
	public member: GuildMember | null;
	public applicationId: Snowflake | null;
	private _user: User;

	// Interaction
	public readonly token: null;
	public type: MessageType;
	public version: null;

	// Message
	public activity: MessageActivity | null;
	public attachments: Collection<Snowflake, MessageAttachment>;
	public readonly cleanContent: string;
	public components: MessageActionRow[];
	public content: string;
	public readonly crosspostable: boolean;
	public readonly deletable: boolean;
	public deleted: boolean;
	public readonly editable: boolean;
	public readonly editedAt: Date | null;
	public editedTimestamp: number | null;
	public embeds: MessageEmbed[];
	public groupActivityApplication: ClientApplication | null;
	public readonly hasThread: boolean;
	public interaction: MessageInteraction | null;
	public mentions: MessageMentions;
	public nonce: string | number | null;
	public readonly partial: false;
	public readonly pinnable: boolean;
	public pinned: boolean;
	public reactions: ReactionManager;
	public stickers: Collection<Snowflake, Sticker>;
	public system: boolean;
	public readonly thread: ThreadChannel | null;
	public tts: boolean;
	public readonly url: string;
	public webhookId: Snowflake | null;
	public flags: Readonly<MessageFlags>;
	public reference: MessageReference | null;


	// BaseCommandInteraction
	public readonly command: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
	public commandId: null;
	public commandName: null;
	public deferred: false;
	public ephemeral: null;
	public replied: false;
	public webhook: null;

	// CommandInteraction
	public options: CommandInteractionOptionResolver;

	// ContextMenuInteraction
	public targetId: null;
	public targetType: null;

	// MessageComponentInteraction
	public readonly component: null;
	public componentType: null;
	public message: Message;
	public customId: null;

	// SelectMenuInteraction
	public values: string[];

	// getters/setters for user/author to underlying _user property
	public get user(): User {return this._user;}
	public set user(user: User) {this._user = user;}
	public get author(): User {return this._user;}
	public set author(author: User) {this._user = author;}


	// Methods
	private readonly _toJSON: Function;
	public toJSON(): unknown {return this._toJSON()}

	// Interaction
	public isButton(): false {return false}
	public isCommand(): false {return false}
	public isContextMenu(): false {return false}
	public isMessageComponent(): false {return false}
	public isSelectMenu(): boolean {return false}
	public inGuild(): boolean {return !!this.guild}

	// Common-ish
	private readonly _reply: Function;
	public reply(options: string | MessagePayload | ReplyMessageOptions): Promise<Message> {return this._reply(options)}
	private readonly _startThread: Function;
	public startThread(options: StartThreadOptions): Promise<ThreadChannel> {return this._startThread(options)}

	// Message
	private readonly _awaitMessageComponent: Function;
	public awaitMessageComponent<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: AwaitMessageComponentOptions<T>,
	): Promise<T> {return this._awaitMessageComponent(options)};
	private readonly _awaitReactions: Function;
	public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>> {return this._awaitReactions(options)};
	private readonly _createReactionCollector: Function;
	public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector {return this._createReactionCollector(options)};
	private readonly _createMessageComponentCollector: Function;
	public createMessageComponentCollector<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: InteractionCollectorOptions<T>,
	): InteractionCollector<T> {return this._createMessageComponentCollector(options)};
	private readonly _delete: Function;
	public delete(): Promise<Message> {return this._delete()};
	private readonly _edit: Function;
	public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message> {return this._edit(content)};
	private readonly _equals: Function;
	public equals(message: Message, rawData: unknown): boolean {return this._equals(message, rawData)};
	private readonly _fetchReference: Function;
	public fetchReference(): Promise<Message> {return this._fetchReference()};
	private readonly _fetchWebhook: Function;
	public fetchWebhook(): Promise<Webhook> {return this._fetchWebhook()};
	private readonly _crosspost: Function;
	public crosspost(): Promise<Message> {return this._crosspost()};
	private readonly _fetch: Function;
	public fetch(force?: boolean): Promise<Message> {return this._fetch(force)};
	private readonly _pin: Function;
	public pin(): Promise<Message> {return this._pin()};
	private readonly _react: Function;
	public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction> {return this._react(emoji)};
	private readonly _removeAttachments: Function;
	public removeAttachments(): Promise<Message> {return this._removeAttachments()};
	private readonly _suppressEmbeds: Function;
	public suppressEmbeds(suppress?: boolean): Promise<Message> {return this._suppressEmbeds(suppress)};
	private readonly _unpin: Function;
	public unpin(): Promise<Message> {return this._unpin()};

	// MessageComponentInteraction
	private readonly _deferReply: Function;
	public deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public deferReply(options?: InteractionDeferReplyOptions & { fetchReply: any | void }): Promise<void>;
	public deferReply(options?: InteractionDeferReplyOptions): Promise<void | Message | APIMessage> {return this._deferReply(options)}
	private readonly _deferUpdate: Function;
	public deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: any | void }): Promise<void>;
	public deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void | Message | APIMessage> {return this._deferUpdate(options)}
	private readonly _deleteReply: Function;
	public deleteReply(): Promise<void> {return this._deleteReply()}
	private readonly _editReply: Function;
	public editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<Message | APIMessage> {return this._editReply(options)}
	private readonly _fetchReply: Function;
	public fetchReply(): Promise<Message | APIMessage> {return this._fetchReply()}
	private readonly _followUp: Function;
	public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage> {return this._followUp(options)}
	private readonly _update: Function;
	public update(options: InteractionUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public update(options: InteractionUpdateOptions & { fetchReply: any | void }): Promise<void>;
	public update(options: string | MessagePayload | InteractionUpdateOptions): Promise<void | Message | APIMessage> {return this._update(options)}

	constructor(source: Message) {
		this.contextReady = false;
		this.source = source;
		this.client = source.client;
		this.channel = source.channel ?? this.user.dmChannel;
		this.channelId = this.channel?.id ?? null;
		this.guild = source.guild;
		this.guildId = source.guildId;
		this.createdAt = source.createdAt;
		this.createdTimestamp = source.createdTimestamp
		this.type = source.type;
		this.id = source.id;
		this.applicationId = source.applicationId;

		this.member = null;
		BaseCommandContext.makeMember(this.client, source.member ?? this.user, this.guild).then(member => {this.member = member; this.contextReady = true});

		this.valueOf = source.valueOf;
		this.toString = source.toString;
		this._toJSON = source.toJSON;
		this._reply = source.reply;

		this.contextType = "message";
		this._user = source.author;
		this.token = null;
		this.version = null;

		this.message = source;

		this.activity = source.activity;
		this.attachments = source.attachments;
		this.cleanContent = source.cleanContent;
		this.content = source.content;
		this.components = source.components;
		this.crosspostable = source.crosspostable;
		this.deletable = source.deletable;
		this.deleted = source.deleted;
		this.editable = source.editable;
		this.editedAt = source.editedAt;
		this.editedTimestamp = source.editedTimestamp;
		this.embeds = source.embeds;
		this.groupActivityApplication = source.groupActivityApplication;
		this.hasThread = source.hasThread;
		this.interaction = source.interaction;
		this.mentions = source.mentions;
		this.nonce = source.nonce;
		this.partial = source.partial;
		this.pinnable = source.pinnable;
		this.pinned = source.pinned;
		this.reactions = source.reactions;
		this.stickers = source.stickers;
		this.system = source.system;
		this.thread = source.thread;
		this.tts = source.tts;
		this.url = source.url;
		this.webhookId = source.webhookId;
		this.flags = source.flags;
		this.reference = source.reference;

		this._startThread = source.startThread;
		this._awaitMessageComponent = source.awaitMessageComponent;
		this._awaitReactions = source.awaitReactions;
		this._createReactionCollector = source.createReactionCollector;
		this._createMessageComponentCollector = source.createMessageComponentCollector;
		this._delete = source.delete;
		this._edit = source.edit;
		this._equals = source.equals;
		this._fetchReference = source.fetchReference;
		this._fetchWebhook = source.fetchWebhook;
		this._crosspost = source.crosspost;
		this._fetch = source.fetch;
		this._pin = source.pin;
		this._react = source.react;
		this._removeAttachments = source.removeAttachments;
		this._suppressEmbeds = source.suppressEmbeds;
		this._unpin = source.unpin;

		this.command = null;
		this.commandId = null;
		this.commandName = null;
		this.deferred = false;
		this.ephemeral = null;
		this.replied = false;
		this.webhook = null;
		this.customId = null;
		this.options = new CommandInteractionOptionResolver(this.client, []);
		this.targetId = null;
		this.targetType = null;
		this.component = null;
		this.componentType = null;
		this.values = [];

		this._deferReply = () => Promise.reject();
		this._deleteReply = () => Promise.reject();
		this._editReply = () => Promise.reject();
		this._fetchReply = () => Promise.reject();
		this._followUp = this.reply;
		this._deferUpdate = () => Promise.reject();
		this._update = () => Promise.reject();
	}

	isMessageContext(): this is MessageCommandContext {
		return true;
	}

	isInteractionContext(): this is InteractionCommandContext {
		return false;
	}
}

class InteractionCommandContext implements BaseCommandContext {
	// CommandContext
	public readonly source: Interaction;
	public readonly contextType: "interaction";
	public contextReady: boolean;

	// Common properties
	public readonly client: Client;
	public readonly channel: TextBasedChannels;
	public channelId: Snowflake;
	public readonly guild: Guild | null;
	public guildId: Snowflake | null;
	public readonly createdAt: Date;
	public readonly createdTimestamp: number;
	public id: Snowflake;
	public member: GuildMember | null;
	public applicationId: Snowflake | null;
	private _user: User;

	// Interaction
	public readonly token: string;
	public type: InteractionType;
	public version: number;

	// Message
	public activity: null;
	public attachments: Collection<Snowflake, MessageAttachment>;
	public readonly cleanContent: string;
	public components: MessageActionRow[];
	public content: string;
	public readonly crosspostable: false;
	public readonly deletable: false;
	public deleted: false;
	public readonly editable: false;
	public readonly editedAt: null;
	public editedTimestamp: null;
	public embeds: MessageEmbed[];
	public groupActivityApplication: null;
	public readonly hasThread: false;
	public interaction: MessageInteraction | null;
	public mentions: MessageMentions;
	public nonce: null;
	public readonly partial: false;
	public readonly pinnable: false;
	public pinned: false;
	public reactions: ReactionManager;
	public stickers: Collection<Snowflake, Sticker>;
	public system: false;
	public readonly thread: null;
	public tts: false;
	public readonly url: null;
	public webhookId: null;
	public flags: Readonly<MessageFlags>;
	public reference: null;


	// BaseCommandInteraction
	public readonly command: ApplicationCommand | ApplicationCommand<{ guild: GuildResolvable }> | null;
	public commandId: Snowflake | null;
	public commandName: Snowflake | null;
	public deferred: boolean;
	public ephemeral: boolean | null;
	public replied: boolean;
	public webhook: InteractionWebhook | null;

	// CommandInteraction
	public options: CommandInteractionOptionResolver;

	// ContextMenuInteraction
	public targetId: Snowflake | null;
	public targetType: Exclude<ApplicationCommandType, 'CHAT_INPUT'> | null;

	// MessageComponentInteraction
	public readonly component: MessageActionRowComponent | Exclude<APIMessageComponent, APIActionRowComponent> | null;;
	public componentType: MessageComponentType | null;
	public message: Message;
	public customId: string | null;

	// SelectMenuInteraction
	public values: string[];

	// getters/setters for user/author to underlying _user property
	public get user(): User {return this._user;}
	public set user(user: User) {this._user = user;}
	public get author(): User {return this._user;}
	public set author(author: User) {this._user = author;}


	// Methods
	private readonly _toJSON: Function;
	public toJSON(): unknown {return this._toJSON()}

	// Interaction
	private readonly _isButton: Function;
	public isButton(): false {return this._isButton()}
	private readonly _isCommand: Function;
	public isCommand(): false {return this._isCommand()}
	private readonly _isContextMenu: Function;
	public isContextMenu(): false {return this._isContextMenu()}
	private readonly _isMessageComponent: Function;
	public isMessageComponent(): false {return this._isMessageComponent()}
	private readonly _isSelectMenu: Function;
	public isSelectMenu(): boolean {return this._isSelectMenu()}
	private readonly _inGuild: Function;
	public inGuild(): boolean {return this._inGuild()}

	// Common-ish
	private readonly _reply: Function;
	public reply(options: string | MessagePayload | InteractionReplyOptions): Promise<void | Message | never> {return this._reply(options)}
	private readonly _startThread: Function;
	public startThread<T>(options: StartThreadOptions | ThreadCreateOptions<T>): Promise<ThreadChannel | never> {return this._startThread(options)}

	// Message
	private readonly _awaitMessageComponent: Function;
	public awaitMessageComponent<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: AwaitMessageComponentOptions<T>,
	): Promise<T> {return this._awaitMessageComponent(options)};
	private readonly _awaitReactions: Function;
	public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>> {return this._awaitReactions(options)};
	private readonly _createReactionCollector: Function;
	public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector {return this._createReactionCollector(options)};
	private readonly _createMessageComponentCollector: Function;
	public createMessageComponentCollector<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: InteractionCollectorOptions<T>,
	): InteractionCollector<T> {return this._createMessageComponentCollector(options)};
	private readonly _delete: Function;
	public delete(): Promise<Message> {return this._delete()};
	private readonly _edit: Function;
	public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message> {return this._edit(content)};
	private readonly _equals: Function;
	public equals(message: Message, rawData: unknown): boolean {return this._equals(message, rawData)};
	private readonly _fetchReference: Function;
	public fetchReference(): Promise<Message> {return this._fetchReference()};
	private readonly _fetchWebhook: Function;
	public fetchWebhook(): Promise<Webhook> {return this._fetchWebhook()};
	private readonly _crosspost: Function;
	public crosspost(): Promise<Message> {return this._crosspost()};
	private readonly _fetch: Function;
	public fetch(force?: boolean): Promise<Message> {return this._fetch(force)};
	private readonly _pin: Function;
	public pin(): Promise<Message> {return this._pin()};
	private readonly _react: Function;
	public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction> {return this._react(emoji)};
	private readonly _removeAttachments: Function;
	public removeAttachments(): Promise<Message> {return this._removeAttachments()};
	private readonly _suppressEmbeds: Function;
	public suppressEmbeds(suppress?: boolean): Promise<Message> {return this._suppressEmbeds(suppress)};
	private readonly _unpin: Function;
	public unpin(): Promise<Message> {return this._unpin()};

	// MessageComponentInteraction
	private readonly _deferReply: Function;
	public deferReply(options: InteractionDeferReplyOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public deferReply(options?: InteractionDeferReplyOptions & { fetchReply: any | void }): Promise<void>;
	public deferReply(options?: InteractionDeferReplyOptions): Promise<void | Message | APIMessage> {return this._deferReply(options)}
	private readonly _deferUpdate: Function;
	public deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public deferUpdate(options: InteractionDeferUpdateOptions & { fetchReply: any | void }): Promise<void>;
	public deferUpdate(options?: InteractionDeferUpdateOptions): Promise<void | Message | APIMessage> {return this._deferUpdate(options)}
	private readonly _deleteReply: Function;
	public deleteReply(): Promise<void> {return this._deleteReply()}
	private readonly _editReply: Function;
	public editReply(options: string | MessagePayload | WebhookEditMessageOptions): Promise<Message | APIMessage> {return this._editReply(options)}
	private readonly _fetchReply: Function;
	public fetchReply(): Promise<Message | APIMessage> {return this._fetchReply()}
	private readonly _followUp: Function;
	public followUp(options: string | MessagePayload | InteractionReplyOptions): Promise<Message | APIMessage> {return this._followUp(options)}
	private readonly _update: Function;
	public update(options: InteractionUpdateOptions & { fetchReply: true }): Promise<Message | APIMessage>;
	public update(options: InteractionUpdateOptions & { fetchReply: any | void }): Promise<void>;
	public update(options: string | MessagePayload | InteractionUpdateOptions): Promise<void | Message | APIMessage> {return this._update(options)}

	constructor(source: Interaction) {
		this.contextType = "interaction";
		this.contextReady = false;
		this.source = source;
		this.client = source.client;
		this.channel = source.channel ?? this.user.dmChannel!;
		this.channelId = this.channel?.id ?? source.channelId;
		this.guild = source.guild;
		this.guildId = source.guildId;
		this.createdAt = source.createdAt;
		this.createdTimestamp = source.createdTimestamp
		this.type = source.type;
		this.id = source.id;
		this.applicationId = source.applicationId;

		this.member = null;
		BaseCommandContext.makeMember(this.client, source.member ?? this.user, this.guild).then(member => {this.member = member; this.contextReady = true});

		this.valueOf = source.valueOf;
		this.toString = source.toString;
		this._toJSON = source.toJSON;
		if(source.isMessageComponent() || source.isCommand() || source.isContextMenu()) this._reply = source.reply;
		else this._reply = (_: string | MessagePayload | InteractionReplyOptions) => Promise.reject();
		this.contextType = "interaction";
		this._user = source.user;
		const mockApiAuthor: APIUser = {id: this.user.id, username: this.user.username, discriminator: this.user.discriminator, avatar: this.user.avatar};
		const mockApiClient: APIUser = {id: this.client.user!.id, username: this.client.user!.username, discriminator: this.client.user!.discriminator, avatar: this.client.user!.avatar};
		const mockMessage = new Message(this.client, {content: "", id: "", channel_id: this.channelId ?? "", author: mockApiAuthor, timestamp: `${this.createdTimestamp}`, edited_timestamp: null, tts: false, mention_everyone: false, mentions: [mockApiClient], mention_roles: [], attachments: [], embeds: [], pinned: false, type: APIMessageType.Default});
		this.token = source.token;
		this.version = source.version;

		this.activity = null;
		this.attachments = new Collection;
		this.cleanContent = "";
		this.content = "";
		this.components = [];
		this.crosspostable = false;
		this.deletable = false;
		this.deleted = false;
		this.editable = false;
		this.editedAt = null;
		this.editedTimestamp = null;
		this.embeds = [];
		this.groupActivityApplication = null;
		this.hasThread = false;
		this.interaction = (source.isCommand() || source.isContextMenu()) ? source : null;
		this.mentions = new MessageMentions(mockMessage, [mockApiClient], new Collection, false); // Long way of saying "mentions the bot"
		this.nonce = null;
		this.partial = false;
		this.pinnable = false;
		this.pinned = false;
		this.reactions = new ReactionManager(mockMessage);
		this.stickers = new Collection;
		this.system = false;
		this.thread = null;
		this.tts = false;
		this.url = null;
		this.webhookId = null;
		this.flags = new MessageFlags();
		this.reference = null;

		this.message = mockMessage;

		this._isButton = source.isButton;
		this._isCommand = source.isCommand;
		this._isContextMenu = source.isContextMenu;
		this._isMessageComponent = source.isMessageComponent;
		this._isSelectMenu = source.isSelectMenu;
		this._inGuild = source.inGuild;

		this._startThread = this.channel && "threads" in this.channel ? this.channel.threads.create : (_: any) => Promise.reject();

		this._awaitMessageComponent = (_?: any) => Promise.reject();
		this._awaitReactions = (_?: any) => Promise.reject();
		this._createReactionCollector = (options?: ReactionCollectorOptions) => new ReactionCollector(mockMessage, options);
		this._createMessageComponentCollector = function<T extends MessageComponentInteraction = MessageComponentInteraction>(options?: InteractionCollectorOptions<T>) {return new InteractionCollector(this.client, options)};
		this._delete = () => Promise.reject();
		this._edit = (_: any) => Promise.reject();
		this._equals = (item: any, raw: any) => this.source == item || this.source == raw;
		this._fetchReference = () => Promise.reject();
		this._fetchWebhook = () => Promise.reject();
		this._crosspost = () => Promise.reject();
		this._fetch = (_?: any) => Promise.resolve(this);
		this._pin = () => Promise.reject();
		this._react = (_: any) => Promise.reject();
		this._removeAttachments = () => Promise.reject();
		this._suppressEmbeds = (_?: any) => Promise.reject();
		this._unpin = () => Promise.reject();

		if(source.isMessageComponent() || source.isContextMenu() || source.isCommand()) {

			this.deferred = source.deferred;
			this.ephemeral = source.ephemeral;
			this.replied = source.replied;
			this.webhook = source.webhook;
			if (source.isMessageComponent()) {
				this.command = null;
				this.commandId = null;
				this.commandName = null;
				this.component = source.component;
				this.componentType = source.componentType;
				this.customId = source.customId;
				this.values = source instanceof SelectMenuInteraction ? source.values : [];
				this.options = new CommandInteractionOptionResolver(this.client, []);
				this.targetId = null;
				this.targetType = null;
			} else {
				this.command = source.command;
				this.commandId = source.commandId;
				this.commandName = source.commandName;
				this.deferred = source.deferred;
				this.ephemeral = source.ephemeral;
				this.replied = source.replied;
				this.webhook = source.webhook;

				this.customId = null;
				this.component = null;
				this.componentType = null;
				this.values = [];

				if(source instanceof CommandInteraction) {
					this.options = source.options;
					this.targetId = null;
					this.targetType = null;
				} else if(source.isContextMenu()) {
					this.options = source.options;
					this.targetId = source.targetId;
					this.targetType = source.targetType;
				} else {
					this.options = new CommandInteractionOptionResolver(this.client, []);
					this.targetId = null;
					this.targetType = null;
				}
			}
		} else {
			this.command = null;
			this.commandId = null;
			this.commandName = null;
			this.deferred = false;
			this.ephemeral = null;
			this.replied = false;
			this.webhook = null;
			this.component = null;
			this.componentType = null;
			this.customId = null;
			this.values = [];

			this.options = new CommandInteractionOptionResolver(this.client, []);
			this.targetId = null;
			this.targetType = null;
		}

		if(source.isCommand() || source.isContextMenu() || source.isMessageComponent()) {
			this._deferReply = source.deferReply;
			this._deleteReply = source.deleteReply;
			this._editReply = source.editReply;
			this._fetchReply = source.fetchReply;
			this._followUp = source.followUp;
			if(this.channel)
				this.channel.send = async (options: string | MessagePayload | MessageOptions | InteractionReplyOptions): Promise<Message> => {
					const r = await this.followUp(options);
					if (r instanceof Message) return r;
					return new Message(this.client, r);
				};

			if(source.isMessageComponent()) {
				this._deferUpdate = source.deferUpdate;
				this._update = source.update;
			} else {
				this._deferUpdate = () => Promise.reject();
				this._update = () => Promise.reject();
			}
		} else {
			this._deferReply = () => Promise.reject();
			this._deleteReply = () => Promise.reject();
			this._editReply = () => Promise.reject();
			this._fetchReply = () => Promise.reject();
			this._followUp = this.reply;
			this._deferUpdate = () => Promise.reject();
			this._update = () => Promise.reject();
		}
	}

	isMessageContext(): this is MessageCommandContext {
		return false;
	}

	isInteractionContext(): this is InteractionCommandContext {
		return true;
	}
}

type ContextSource = Message | Interaction;
type CommandContext = MessageCommandContext | InteractionCommandContext;

function isCommandContext(context: any): context is CommandContext {
	return context instanceof BaseCommandContext;
}

export function getCommandContext<T extends CommandContext, K extends T["contextType"]>(source: T): Extract<CommandContext, { contextType: K }>;
export function getCommandContext<T extends ContextSource, K extends (T extends Message ? "message" : "interaction")>(source: T): Extract<CommandContext, { contextType: K }>;
export function getCommandContext(source: ContextSource | CommandContext): CommandContext {
	if(isCommandContext(source)) return getCommandContext(source.source);
	if(source instanceof Message) return new MessageCommandContext(source);
	return new InteractionCommandContext(source);
}

export default CommandContext;
