import type { WikiResponse } from './WikiResponse';
import { wikiRequestInit } from './WikiApi';
import { getWikiUrl, Lang } from "@lang";
import { sampleSize } from "@utils";
import fetch from "node-fetch";
import type { Request, RequestInit } from "node-fetch";
import type { WikiRequest } from "./WikiRequest";
import Querystring from "node:querystring";
import { getRandomTitle, getRandomTitleNotIn } from './randomPage';


export async function selectPages(suggestions: string[], lang: Lang, n = 2): Promise<string[]> {
    const promises: Promise<string>[] =     [];
    const titles:string[] = []; 
    for (let i = 0; i < n; i++) {
        const suggestion = suggestions.popRandom();
        const promise = new Promise(async (resolve, reject)=>{
            var title:string;
            do {
                const suggestion = suggestions.popRandom();
                title = await (suggestion != null ? getTitleOfSuggestion(suggestion, lang)
                                                :   getRandomTitleNotIn(lang, titles));
            } while (titles.findIndex(t=>t==title)!=-1)
            resolve(title);
        }) as Promise<string>;
        promises.push(promise);
    }
    await Promise.all(promises)
    return titles;
}

export async function getTitleOfSuggestion(suggestion: string, lang: Lang) {
    const param: WikiRequest = {
        action: "query",
        format: "json",
        formatversion: "2",
        list: "search",
        srlimit: 1,
        srnamespace: 0,
        srsearch: "intitle:" + suggestion,
        srprop: ""
    };
    const encodedParam = "/w/api.php?" + Querystring.encode(param);
    console.log(getWikiUrl(lang) + encodedParam, wikiRequestInit);
    const json = await fetch(getWikiUrl(lang) + encodedParam, wikiRequestInit)
                        .then(res => res.json() as Promise<WikiResponse>);
    if (json.query.searchinfo.totalhits == 0) {
        return await getRandomTitle(lang);
    } else {
        return json.query.search[0]!.title;
    }
}