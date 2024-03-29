import type { APIChannel, APIGuildMember } from "discord-api-types/v9";
import { User, GuildMember, UserFlags, Role, GuildChannel } from "discord.js";
import * as Emotes from "../emotes.json";
import { APIRole } from "discord-api-types/v10";
import { realpath } from "fs/promises";

// Miscellaneous helper functions & idioms
// So they don't need to be referenced from bulbutils

export function tryIgnore<T extends (...args: any[]) => any>(cb: T, ...args: Parameters<T>): ReturnType<T> | undefined {
	try {
		const val = cb(...args);
		if (val instanceof Promise) {
			return val.catch((_) => undefined) as ReturnType<T>;
		}
		return val;
		// eslint-disable-next-line no-empty
	} catch {}
	return undefined;
}

/** This is not a deep clone, to be clear */
export function clone<T extends object | null>(obj: T): T {
	return Object.assign(Object.create(obj), obj);
}

export function interpolateArrays<T extends any[]>(...args: T[]): T {
	if (args.length < 2) return args[0];
	const lengths = args.map((arr) => arr.length);
	const longestLength = Math.max(...lengths);
	const interpolated: any[] = [];
	for (let i = 0; i < longestLength; ++i) {
		for (let j = 0; j < args.length; ++j) {
			const arr = args[j];
			if (arr.length <= i) continue;
			interpolated.push(arr[i]);
		}
	}
	return interpolated as T;
}

export function emote(strings: TemplateStringsArray, ...actions: string[]): string {
	const emoteResolver: Record<string, string> = {
		Ban: Emotes.actions.BAN,
		"Manual Ban": Emotes.actions.BAN,
		"Force-ban": Emotes.actions.BAN,
		Kick: Emotes.actions.KICK,
		"Manual Kick": Emotes.actions.KICK,
		Mute: Emotes.actions.MUTE,
		Warn: Emotes.actions.WARN,
		Unmute: Emotes.actions.UNBAN,
		Unban: Emotes.actions.UNBAN,
		true: Emotes.status.ONLINE,
		false: Emotes.other.INF1,
		Nickname: Emotes.other.EDIT,
	};
	const resolveEmotes = actions.map((action) => emoteResolver[action] || action);
	return interpolateArrays([...strings], resolveEmotes).join(" ");
}

type GuildMemberMaybeApi = GuildMember | APIGuildMember;
type GuildRoleMaybeApi = Role | APIRole;
type GuildChannelMaybeApi = GuildChannel | APIChannel;

/** Dark Magic */
export function resolveGuildMemberUnsafe(memberInput: GuildMemberMaybeApi): GuildMember {
	if (memberInput instanceof GuildMember) {
		return memberInput;
	}

	const { joined_at, avatar, communication_disabled_until, nick, pending, premium_since, user } = memberInput;

	const { avatar: userAvatar, discriminator, id, username, accent_color, banner, bot, flags, system } = user || {};

	const fakeUser: User = Object.create(User.prototype);
	Object.assign(fakeUser, {
		avatar: userAvatar,
		discriminator,
		accentColor: accent_color,
		banner,
		bot,
		flags: new UserFlags(flags),
		id,
		username,
		system,
	});

	const joinedTimestamp = parseInt(joined_at, 10);
	const premiumSinceTimestamp = premium_since != null ? parseInt(premium_since, 10) : premium_since;

	const fakeMember = Object.create(GuildMember.prototype);
	Object.assign(fakeMember, {
		avatar,
		communicationDisabledUntil: typeof communication_disabled_until === "string" ? new Date(communication_disabled_until) : communication_disabled_until,
		user: fakeUser,
		joinedTimestamp,
		joinedAt: new Date(joinedTimestamp),
		nickname: nick,
		pending,
		premiumSinceTimestamp,
		premiumSince: premiumSinceTimestamp != null ? new Date(premiumSinceTimestamp) : premiumSinceTimestamp,
	});

	return fakeMember;
}

/** Calls a private constructor in D.JS */
// prettier-ignore
export const resolveGuildMemberMoreSafe = (memberInput: GuildMemberMaybeApi): GuildMember => (memberInput instanceof GuildMember)
	? memberInput
	// @ts-expect-error This is a private constructor don't worry about it
	: new GuildMember(memberInput);

// prettier-ignore
export const resolveGuildRoleMoreSafe = (roleInput: GuildRoleMaybeApi): Role =>
	roleInput instanceof Role
		? roleInput
    // @ts-expect-error
		: new Role(roleInput);

/** Returns true if |v| is null or undefined ("nullish"), false otherwise */
// Intentionally uses abstract equality operator (==), not strict equality.
// null with `==` only returns true when comparing with either null or undefined,
// thus suiting our purposes
export const isNullish = (v: any): v is null | undefined => v == null;

/** Will only execute `cb` if `val` is not nullish. Returns undefined if val is nullish */
export const nullsafe = <T, F extends (val: T) => R, R = ReturnType<F>>(val: T, cb: F) => (!isNullish(val) ? cb(val) : undefined);

export const clamp = (val: number) => +(val > 0) && val;

type PaginateOptions = {
	take?: number;
	skip?: number;
};
export const paginate = ({ page = 1, pageSize = 25 }: Paginatetable): PaginateOptions => ({
	take: page * pageSize || undefined,
	skip: clamp(page - 1) * pageSize || undefined,
});

// TODO: I have reservations about this one
export const resolveGuildChannelMoreSafe = (channelInput: GuildChannelMaybeApi): GuildChannel =>
	channelInput instanceof GuildChannel
		? channelInput
		: // @ts-expect-error
		  new Channel(channelInput);

export const unpackSettled = <T>(settled: PromiseSettledResult<T>[]): T[] => {
	const resolved: T[] = [];
	for (const result of settled) {
		if (result.status === "fulfilled") {
			resolved.push(result.value);
		}
		// This will drop any rejections silently. Only use it if that is fine
	}
	return resolved;
};

// FS exists is deprecated for various reasons, but in our usecase we need to check
/**
 * Pollyfill of fs.exists in promise form. fs.exists is deprecated for various reasons,
 * however in our usage (as of writing) it really is the correct thing to do. Rather than
 * use the undeprecated existsSync, we should try to stick with async options
 */
export const exists = (...args: Parameters<typeof realpath>): Promise<boolean> =>
	realpath(...args)
		.then(() => true)
		.catch(() => false);
