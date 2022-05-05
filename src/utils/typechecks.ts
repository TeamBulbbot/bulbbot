import { AnyChannel, BaseGuildTextChannel, Channel, GuildBasedChannel, TextChannel } from "discord.js";

export function isBaseGuildTextChannel(channel: Maybe<Channel>): channel is BaseGuildTextChannel {
	return !!channel && "defaultAutoArchiveDuration" in channel;
}

export function isTextChannel(channel: Maybe<Channel>): channel is TextChannel {
	return !!channel && "rateLimitPerUser" in channel;
}

export function isGuildChannel(channel: Maybe<Channel>): channel is GuildBasedChannel;
export function isGuildChannel(channel: Maybe<AnyChannel>): channel is GuildBasedChannel;
export function isGuildChannel(channel: Maybe<any>): channel is GuildBasedChannel {
	return !!channel && "guild" in channel;
}
