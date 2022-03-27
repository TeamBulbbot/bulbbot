// Miscellaneous helper functions & idioms
// So they don't need to be referenced from bulbutils

export function tryIgnore<T extends (...args: any[]) => any>(
	cb: T,
	...args: Parameters<T>
): ReturnType<T> | undefined {
	try {
		const val = cb(...args)
		if (val instanceof Promise) {
			return val.catch((_) => undefined) as ReturnType<T>
		}
		return val
		// eslint-disable-next-line no-empty
	} catch {}
	return undefined
}
