import { User, GuildMember, Snowflake, GuildMemberManager, GuildChannelManager, GuildChannel, ThreadChannel, RoleManager, Role } from "discord.js";
import BulbBotClient from "../structures/BulbBotClient";

export default class {
	private readonly client: BulbBotClient;

	constructor(client: BulbBotClient) {
		this.client = client;
	}

	public async getUser(userId: Snowflake): Promise<User> {
		let user: User | undefined = this.client.users.cache.get(userId);

		// FIXME: Philip should fix this as the owner of this new fetching system.
		//  Throwing an error just so it gets caught elsewhere is prolly not the best idea
		if (!userId.length) throw new Error("This should get caught by our systems and get handled in the rest of the code");
		if (!user) user = await this.client.users.fetch(userId);

		return user;
	}

	public async getGuildMember(members: GuildMemberManager | undefined, userId: Snowflake): Promise<GuildMember | undefined> {
		if (!members) return undefined;
		let member: GuildMember | undefined = members.cache.get(userId);
		if (!userId.length) return undefined;
		if (!member) member = await members.fetch(userId).catch(_ => undefined);

		return member;
	}

	public async getChannel(channels: GuildChannelManager | undefined, channelId: Snowflake) {
		if (!channels) return undefined;
		let channel: GuildChannel | ThreadChannel | undefined | null = channels.cache.get(channelId);
		if (!channelId.length) return undefined;
		if (!channel) channel = await channels.fetch(channelId).catch(_ => undefined);

		return channel;
	}

	public async getRole(roles: RoleManager | undefined, roleId: Snowflake) {
		if (!roles) return undefined;
		let role: Role | undefined | null = roles.cache.get(roleId);
		if (!roleId.length) return undefined;
		if (!role) role = await roles.fetch(roleId).catch(_ => undefined);

		return role;
	}
}
