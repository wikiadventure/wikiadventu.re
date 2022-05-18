import type { WikiResponse } from './WikiResponse';
import { wikiRequestInit } from './WikiApi';
import { getWikiUrl, Lang } from "@lang";
import { sampleSize } from "@utils";
import fetch from "node-fetch";
import type { Request, RequestInit } from "node-fetch";
import type { WikiRequest } from "./WikiRequest";
import Querystring from "node:querystring";
import { getRandomTitle, getRandomTitleNotIn } from './randomPage';


export async function selectPages(suggestions: Array<number|null|undefined>, lang: Lang, n = 2): Promise<WikiPage[]> {
    const promises: Promise<WikiPage>[] = [];
    const pages:WikiPage[] = []; 
    for (let i = 0; i < n; i++) {
        const promise = new Promise<WikiPage>(async (resolve, reject)=>{
            let page:WikiPage;
            do {
                const suggestion = suggestions.popRandom();
                page = await (suggestion != null ? getWikiPageOfId(suggestion, lang)
                                                :   getRandomTitleNotIn(lang, pages));
            } while (pages.findIndex(p=>p.id==page.id)!=-1)
            resolve(page);
        });
        promises.push(promise);
    }
    await Promise.all(promises)
    return pages;
}

export async function getWikiPageOfId(id: number, lang: Lang):Promise<WikiPage> {
    const param: WikiRequest = {
        action: "query",
        format: "json",
        formatversion: "2",
        pageids: id,
        redirects: 1
    };
    const encodedParam = "/w/api.php?" + Querystring.encode(param);
    console.log(getWikiUrl(lang) + encodedParam, wikiRequestInit);
    const json = await fetch(getWikiUrl(lang) + encodedParam, wikiRequestInit)
                        .then(res => res.json() as Promise<WikiResponse>);
    
    const page = json?.query?.pages[0];
    if (page == null || page.ns != 0) return await getRandomTitle(lang);
    return { id: page.pageid, title: page.title };

}

export type WikiPage = {
    id: number,
    title: string
}