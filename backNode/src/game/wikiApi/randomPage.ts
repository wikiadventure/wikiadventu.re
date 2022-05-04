import type { WikiResponse } from './WikiResponse';
import { wikiRequestInit } from './WikiApi';
import { getWikiUrl, Lang } from "@lang";
import fetch from "node-fetch";
import type { WikiRequest } from "./WikiRequest";
import Querystring from "node:querystring";

export const randomTitleCacheMap = new Map<Lang, string[]>();

export async function getNewRandomTitle(lang:Lang):Promise<void> {
    const param:WikiRequest = {
        action: "query",
        format: "json",
        formatversion: "2",
        list: "random",
        rnnamespace: 0,
        rnlimit: 500,
    };
    const encodedParam = "/w/api.php?" + Querystring.encode(param);
    const json = await fetch(getWikiUrl(lang)+encodedParam, wikiRequestInit)
                        .then(res=>res.json() as Promise<WikiResponse>);
    const titles = json.query.random.map(p=>p.title);
    var cache = randomTitleCacheMap.get(lang);
    randomTitleCacheMap.set(lang, cache == null ? titles : cache.concat(titles));
}

export async function getRandomTitle(lang:Lang):Promise<string> {
    const cache = randomTitleCacheMap.get(lang);
    if (cache == null || cache.length == 0) {
        await getNewRandomTitle(lang);
        return randomTitleCacheMap.get(lang)!.pop()!;
    }
    return cache!.pop()!;
}

export async function getRandomTitleNotIn(lang:Lang, titles:string[]):Promise<string> {
    var cache = randomTitleCacheMap.get(lang);
    if (cache == null || cache.length == 0) {
        await getNewRandomTitle(lang);
        cache = randomTitleCacheMap.get(lang)!;
    }
    var i = 0;
    while (true) {
        if (cache[i]==null){
            await getNewRandomTitle(lang);
            cache = randomTitleCacheMap.get(lang)!;
        }
        if (titles.findIndex(t=>t==cache![i]) == -1) return cache.splice(i,1)[0]!;
        i++;
    }
}
