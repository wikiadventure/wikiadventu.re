import { Lang } from '@lang';
import type { RouteShorthandOptions } from 'fastify';
import { enumValuesToArray as n } from "@utils";
import S from "fluent-json-schema";;

export type DailyRequest = {
    lang: Lang
}

type d09 = 0|1|2|3|4|5|6|7|8|9;
type d19 =   1|2|3|4|5|6|7|8|9;
type DD = `${0}${d19}` | `${1|2}${d09}` | `3${0|1}`;
type MM = `0${d19}` | `1${0|1|2}`;
type YYYY = `202${2|3}`;
// date with format dd/mm/yyyy
export type DailyDate = /*`${DD}/${MM}/${YYYY}`*/string;

export type DailyPageType = {
    start: string,
    end: string
}

export const dailySchema = S.object()
    .title("The WikiAdventure daily schema")
    .prop("lang", S.string().enum(n(Lang)).required());

export const dailyOptions: RouteShorthandOptions = { schema: { body: dailySchema } };
