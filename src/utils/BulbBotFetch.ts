import { User, GuildMember, Snowflake, GuildMemberManager, GuildChannelManager, GuildChannel, ThreadChannel, RoleManager, Role, Guild, DataManager, GuildManager } from "discord.js";
import BulbBotClient from "../structures/BulbBotClient";

export default class BulbFetch {
	private readonly client: BulbBotClient;

	constructor(client: BulbBotClient) {
		this.client = client;
	}

	public async getUser(userId: Maybe<Snowflake>): Promise<Optional<User>> {
		return this.bulbfetch(this.client.users, userId);
	}

	public async getGuildMember(members: GuildMemberManager | undefined, userId: Maybe<Snowflake>): Promise<Optional<GuildMember>> {
		return this.bulbfetch(members, userId);
	}

	public async getChannel(channels: GuildChannelManager | undefined, channelId: Maybe<Snowflake>): Promise<Optional<GuildChannel | ThreadChannel>> {
		return this.bulbfetch(channels, channelId);
	}

	public async getRole(roles: RoleManager | undefined, roleId: Maybe<Snowflake>): Promise<Optional<Role>> {
		return this.bulbfetch(roles, roleId);
	}

	public async getGuild(guildId: Snowflake, guilds: Maybe<GuildManager> = this.client.guilds): Promise<Optional<Guild>> {
		return this.bulbfetch(guilds, guildId);
	}

	// We can just use this from now on instead of adding a new 'getX' method each time we need a thing.
	// I would prefer it not be an instance method though because there's no reason for it to be
	public async bulbfetch<K, Holds, R>(manager: Maybe<DataManager<K, Holds, R>>, id: Maybe<K>): Promise<Optional<Holds>> {
		// Ensure the manager and ID are defined
		if (!id || !manager) return undefined;
		// Attempt to get the data from the manager cache
		const item = manager.cache.get(id);
		// If the item is in the cache, return it
		if (item) return item;
		// Otherwise, fetch the data from the API
		// @ts-expect-error DataManager does not actually define the fetch method, so it may be undefined with these typings
		return (manager.fetch?.(id).catch(() => undefined) ?? undefined) as Optional<Holds>;
	}
}
