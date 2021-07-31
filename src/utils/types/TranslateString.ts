import translation from "../../languages/en-US.json";
import translationNew from "../../languages/en-US-new.json";

export type TranslateString = keyof typeof translation;
export type TranslateNewString = keyof typeof translationNew;
