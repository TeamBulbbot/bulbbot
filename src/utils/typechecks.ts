import { BaseGuildTextChannel, Channel } from "discord.js";

export function isBaseGuildTextChannel(channel: Maybe<Channel>): channel is BaseGuildTextChannel {
	return !!channel && "defaultAutoArchiveDuration" in channel;
}
