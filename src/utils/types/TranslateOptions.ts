import enUS from '../../languages/en-US'

type FirstLevelObjectWithTranslateValues<T> = T extends string ? never : { [K in keyof T as BeforeDot<K & string>]: Infer<TranslateValue<T[K]>> }
type ObjectWithTranslateValues<T> = T extends string ? {} : { [K in keyof T as BeforeDot<K & string>]: Infer<TranslateValue<T[K]>> }
type TranslateValue<T> = T extends `${string}{{${infer V}}}${infer S}` ? OptionIdentifier<V> & StringPart<S> : ObjectWithTranslateValues<T>

export type BeforeDot<T extends string> = T extends `${infer U}.${string}` ? U : T
type AfterDot<T extends string> = T extends `${string}.${infer U}` ? U : ""

type AllowedEmotes = "text" | "annoncement" | "announcement" | "voice" | "stage" | "category"

// eslint-disable-next-line
type OptionIdentifier<V extends string> = V extends `emote_${infer U}` ? U extends AllowedEmotes ?
OptionIdentifierStruct<V> : {} : OptionIdentifierStruct<V>

type OptionIdentifierStruct<V extends string> = {
	// For emotes in the allow list
	[K in V as BeforeDot<V>]: AfterDot<V> extends "" ? any : {
		[J in AfterDot<V> as BeforeDot<AfterDot<V>>]: any
	}
}

// eslint-disable-next-line
type StringPart<S> = S extends `${string}{{${string}}}${string}` ? TranslateValue<S> : {}

export type DeepAccess<T, S extends string> = T extends object ? AfterDot<S> extends "" ? S extends keyof T ? T[S] : never
	: BeforeDot<S> extends keyof T ? DeepAccess<T[BeforeDot<S>], AfterDot<S>> : never : T

type Infer<T> = T extends object ? { [K in keyof T as T[K] extends never ? never : K & string]: Infer<T[K]> } : T

export type TranslateOptions = Infer<FirstLevelObjectWithTranslateValues<typeof enUS>>
export default TranslateOptions
