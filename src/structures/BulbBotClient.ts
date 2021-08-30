import { Client, Collection, Permissions, Intents, BitField, PermissionString } from "discord.js";
import ClientException from "./exceptions/ClientException";
import Event from "./Event";
import Util from "./Util";
import Command from "./Command";
import BulbBotUtils from "../utils/BulbBotUtils";
import * as Config from "../Config";
import { logger } from "../utils/Logger";

export default class extends Client {
	public prefix: string = Config.prefix;
	public commands: Collection<string, Command>;
	public aliases: Collection<string, string>;
	public events: Collection<string, Event>;
	public defaultPerms!: Readonly<BitField<PermissionString, bigint>>;
	private readonly utils: Util;
	public readonly bulbutils: BulbBotUtils;
	public userClearance: number = 0;
	public blacklist: Collection<string, Record<string, any>>;
	public banpoolInvites: Collection<string, Record<string, any>>;
	public log: any;
	public about: any;

	constructor(options: any) {
		super({
			intents: new Intents(Config.intents),
			http: { version: 9 },
			messageCacheLifetime: 0,
			messageSweepInterval: 0,
			restTimeOffset: 500,
		});
		this.validate(options);

		this.commands = new Collection();
		this.aliases = new Collection();

		this.events = new Collection();

		this.utils = new Util(this);
		this.bulbutils = new BulbBotUtils(this);

		this.blacklist = new Collection();
		this.banpoolInvites = new Collection();

		this.about = {};

		this.log = logger;
	}

	private validate(options: any): void {
		if (typeof options !== "object") throw new ClientException("Options must be type of Object!");

		if (!options.token) throw new ClientException("Client cannot log in without token!");
		this.token = options.token;

		if (!options.prefix) throw new ClientException("Client cannot log in without prefix!");
		this.prefix = options.prefix;

		if (!options.defaultPerms) throw new ClientException("Default permissions cannot be null!");
		this.defaultPerms = new Permissions(options.defaultPerms).freeze();
	}

	public async login(token = this.token): Promise<any> {
		await this.utils.loadEvents();
		await this.utils.loadCommands();
		await this.utils.loadBlacklist();
		await this.utils.loadAbout();

		await super.login(<string>token);
	}
}
