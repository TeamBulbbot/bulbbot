import translation from "../../languages/en-US.json";

// https://stackoverflow.com/a/58436959
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];
type Join<K, P> = K extends string | number ? (P extends string | number ? `${K}${"" extends P ? "" : "."}${P}` : never) : never;
type Leaves<T, D extends number = 10> = [D] extends [never] ? never : T extends object ? (T extends any[] ? "" : { [K in keyof T]-?: Join<K, Leaves<T[K], Prev[D]>> }[keyof T]) : "";

type TranslateString = Leaves<typeof translation, 4>;
export default TranslateString;
