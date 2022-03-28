import enUS from '../../languages/en-US'

type ObjectWithTranslateValues<T> = T extends string ? never : { [K in keyof T as K & string]: Infer<TranslateValue<T[K]>> }
type TranslateValue<T> = T extends `${string}{{${infer V}}}${infer S}` ? OptionIdentifier<V> & StringPart<S> : ObjectWithTranslateValues<T>

export type BeforeDot<T extends string> = T extends `${infer U}.${string}` ? U : T
type AfterDot<T extends string> = T extends `${string}.${infer U}` ? U : ""

// eslint-disable-next-line
type OptionIdentifier<V extends string> = V extends `emote_${string}` ? {} : {
	[K in V as BeforeDot<V>]: AfterDot<V> extends "" ? any : {
		[J in AfterDot<V> as BeforeDot<AfterDot<V>>]: any
	}
}

// eslint-disable-next-line
type StringPart<S> = S extends `${string}{{${string}}}${string}` ? TranslateValue<S> : {}

type Infer<T> = T extends object ? { [K in keyof T as T[K] extends never ? never : K & string]: Infer<T[K]> } : T

export type TranslateOptions = Infer<ObjectWithTranslateValues<typeof enUS>>
export default TranslateOptions
