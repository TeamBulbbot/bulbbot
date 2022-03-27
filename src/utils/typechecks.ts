import { BaseGuildTextChannel, Channel, TextChannel } from "discord.js";

export function isBaseGuildTextChannel(channel: Maybe<Channel>): channel is BaseGuildTextChannel {
	return !!channel && "defaultAutoArchiveDuration" in channel;
}

export function isTextChannel(channel: Maybe<Channel>): channel is TextChannel {
	return !!channel && "rateLimitPerUser" in channel;
}
