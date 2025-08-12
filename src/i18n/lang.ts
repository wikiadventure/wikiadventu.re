import { endonym_to_langcode } from "../composables/wikiLang";

export type LangType = typeof endonym_to_langcode;

export type LangCode =  keyof LangType;

export type LangLabel = LangType[LangCode];

export const langsKey = Object.keys(endonym_to_langcode) as LangCode[];
