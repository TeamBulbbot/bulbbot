// Types declared in this file are globally available to TypeScript
// Do not import or export anything to/from this file, or it will break

/**
 * Most generic function signature. If you just want to annotate something as a function with
 * any signature, you should use this. Note that you should not use `Function` to do that
 */
type Callable = (...args: any[]) => any;
/** Semantic "or null" */
type Nullable<T> = T | null;
/** Semantic "or undefined" */
type Optional<T> = T | undefined;
/** Semantic "may be null or undefined" */
type Maybe<T> = T | null | undefined;
/** Inverse of TypeScript built-in utility type `Exclude<T, U>` */
type Include<T, U> = T extends U ? T : never;
/** Generic interface for anything with an id field. Can be used for mixins, type annotations, etc. */
interface Identifiable {
	id: string;
}

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;
