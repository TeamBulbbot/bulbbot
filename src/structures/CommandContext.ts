import { APIInteractionGuildMember, APIUser, MessageType } from "discord-api-types";
import { AwaitMessageComponentOptions, AwaitReactionsOptions, BaseCommandInteraction, Client, ClientApplication, Collection, EmojiIdentifierResolvable, Guild, GuildMember, Interaction, InteractionCollector, InteractionCollectorOptions, InteractionReplyOptions, InteractionType, Message, MessageActionRow, MessageActivity, MessageAttachment, MessageComponentInteraction, MessageEditOptions, MessageEmbed, MessageFlags, MessageInteraction, MessageMentions, MessagePayload, MessageReaction, MessageReference, ReactionCollector, ReactionCollectorOptions, ReactionManager, ReplyMessageOptions, Snowflake, StartThreadOptions, Sticker, TextBasedChannels, ThreadChannel, ThreadCreateOptions, User, Webhook } from "discord.js";

export default class CommandContext {
	public readonly source: Message | Interaction;
	public readonly contextType: "message" | "interaction";

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

	public readonly token: string | null;
	public type: InteractionType | MessageType;
	public version: number | null;

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
	public readonly url: string | null;
	public webhookId: Snowflake | null;
	public flags: Readonly<MessageFlags>;
	public reference: MessageReference | null;

	public contextReady: boolean;

	public get user(): User {return this._user;}
	public set user(user: User) {this._user = user;}
	public get author(): User {return this._user;}
	public set author(author: User) {this._user = author;}

	private _toJSON: Function;
	public toJSON(): unknown {return this._toJSON()}

	private _isButton: Function;
	public isButton(): boolean {return this._isButton()}
	private _isCommand: Function;
	public isCommand(): boolean {return this._isCommand()}
	private _isContextMenu: Function;
	public isContextMenu(): boolean {return this._isContextMenu()}
	private _isMessageComponent: Function;
	public isMessageComponent(): boolean {return this._isMessageComponent()}
	private _isSelectMenu: Function;
	public isSelectMenu(): boolean {return this._isSelectMenu()}
	private _inGuild: Function;
	public inGuild(): boolean {return this._inGuild()}

	private _reply: Function;
	public reply(options: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions): Promise<void | Message | never> {return this._reply(options)}
	private _startThread: Function;
	public startThread<T>(options: StartThreadOptions | ThreadCreateOptions<T>): Promise<ThreadChannel | never> {return this._startThread(options)}

	private _awaitMessageComponent: Function;
	public awaitMessageComponent<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: AwaitMessageComponentOptions<T>,
	): Promise<T> {return this._awaitMessageComponent(options)};
	private _awaitReactions: Function;
	public awaitReactions(options?: AwaitReactionsOptions): Promise<Collection<Snowflake | string, MessageReaction>> {return this._awaitReactions(options)};
	private _createReactionCollector: Function;
	public createReactionCollector(options?: ReactionCollectorOptions): ReactionCollector {return this._createReactionCollector(options)};
	private _createMessageComponentCollector: Function;
	public createMessageComponentCollector<T extends MessageComponentInteraction = MessageComponentInteraction> (
		options?: InteractionCollectorOptions<T>,
	): InteractionCollector<T> {return this._createMessageComponentCollector(options)};
	private _delete: Function;
	public delete(): Promise<Message> {return this._delete()};
	private _edit: Function;
	public edit(content: string | MessageEditOptions | MessagePayload): Promise<Message> {return this._edit(content)};
	private _equals: Function;
	public equals(message: Message, rawData: unknown): boolean {return this._equals(message, rawData)};
	private _fetchReference: Function;
	public fetchReference(): Promise<Message> {return this._fetchReference()};
	private _fetchWebhook: Function;
	public fetchWebhook(): Promise<Webhook> {return this._fetchWebhook()};
	private _crosspost: Function;
	public crosspost(): Promise<Message> {return this._crosspost()};
	private _fetch: Function;
	public fetch(force?: boolean): Promise<Message> {return this._fetch(force)};
	private _pin: Function;
	public pin(): Promise<Message> {return this._pin()};
	private _react: Function;
	public react(emoji: EmojiIdentifierResolvable): Promise<MessageReaction> {return this._react(emoji)};
	private _removeAttachments: Function;
	public removeAttachments(): Promise<Message> {return this._removeAttachments()};
	private _suppressEmbeds: Function;
	public suppressEmbeds(suppress?: boolean): Promise<Message> {return this._suppressEmbeds(suppress)};
	private _unpin: Function;
	public unpin(): Promise<Message> {return this._unpin()};

	constructor(source: Message | Interaction) {
		this.contextReady = false;
		this.source = source;
		this.client = source.client;
		this.channel = source.channel ?? this.user.dmChannel!;
		this.channelId = this.channel?.id ?? null;
		this.guild = source.guild;
		this.guildId = source.guildId;
		this.createdAt = source.createdAt;
		this.createdTimestamp = source.createdTimestamp
		this.type = <InteractionType | MessageType>source.type;
		this.id = source.id;
		this.applicationId = source.applicationId;

		this.member = null;
		CommandContext.makeMember(this.client, source.member ?? this.user, this.guild).then(member => {this.member = member; this.contextReady = true});

		this.valueOf = source.valueOf;
		this.toString = source.toString;
		this._toJSON = source.toJSON;
		if("reply" in source) this._reply = source.reply;
		else this._reply = (_: string | MessagePayload | ReplyMessageOptions | InteractionReplyOptions) => Promise.reject();

		if(source instanceof Interaction) {
			const mockApiAuthor: APIUser = {id: this.user.id, username: this.user.username, discriminator: this.user.discriminator, avatar: this.user.avatar};
			const mockApiClient: APIUser = {id: this.client.user!.id, username: this.client.user!.username, discriminator: this.client.user!.discriminator, avatar: this.client.user!.avatar};
			const mockMessage = new Message(this.client, {content: "", id: "", channel_id: this.channelId, author: mockApiAuthor, timestamp: `${this.createdTimestamp}`, edited_timestamp: null, tts: false, mention_everyone: false, mentions: [mockApiClient], mention_roles: [], attachments: [], embeds: [], pinned: false, type: MessageType.Default});
			this.contextType = "interaction";
			this._user = source.user;
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
			this.interaction = (source instanceof BaseCommandInteraction) ? source : null;
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

		} else if(source instanceof Message) {
			this.contextType = "message";
			this._user = source.author;
			this.token = null;
			this.version = null;

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

			this._isButton = () => false;
			this._isCommand = () => false;
			this._isContextMenu = () => false;
			this._isMessageComponent = () => false;
			this._isSelectMenu = () => false;
			this._inGuild = () => !!this.guild;

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

		} else {
			// makes TS happy and does safety stuff
			throw new Error();
		}
	}

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
}
