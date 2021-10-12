import { User, GuildMember, Snowflake, GuildMemberManager, GuildChannelManager, GuildChannel, ThreadChannel, RoleManager, Role, ChannelManager, Channel } from "discord.js";
import BulbBotClient from "../structures/BulbBotClient";

export default class {
	private readonly client: BulbBotClient;

	constructor(client: BulbBotClient) {
		this.client = client;
	}

	public async getUser(userId: Snowflake): Promise<User> {
		let user: User | undefined = this.client.users.cache.get(userId);
		if (!user) user = await this.client.users.fetch(userId);
		return user;
	}

	public async getGuildMember(members: GuildMemberManager | undefined, userId: Snowflake): Promise<GuildMember | undefined> {
		if (!members) return undefined;
		let member: GuildMember | undefined = members.cache.get(userId);
		if (!member) member = await members.fetch(userId);

		return member;
	}

	public async getChannel(channels: GuildChannelManager | undefined, channelId: Snowflake) {
		if (!channels) return undefined;
		let channel: GuildChannel | ThreadChannel | undefined | null = channels.cache.get(channelId);
		if (!channel) channel = await channels.fetch(channelId);

		return channel;
	}

	public async getRole(roles: RoleManager | undefined, roleId: Snowflake) {
		if (!roles) return undefined;
		let role: Role | undefined | null = roles.cache.get(roleId);
		if (!role) role = await roles.fetch(roleId);

		return role;
	}
}
