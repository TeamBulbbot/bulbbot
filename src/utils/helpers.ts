import * as Emotes from "../emotes.json";

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
