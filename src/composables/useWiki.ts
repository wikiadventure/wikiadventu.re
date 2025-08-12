import type { LangCode } from "../i18n/lang";
import { createSeededRandomGenerator, generateCloseNumbers } from "./numberUtils";

export async function loadPreviews(titles: string[], wiki_lang: LangCode, signal?: AbortSignal) {
    var url = new URL('https://' + wiki_lang + '.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
        action: 'query',
        format: 'json',
        titles: titles.join("|"),
        redirects: '1', // Automatically resolve redirects
        prop: 'pageprops|pageimages|pageterms',
        piprop: 'thumbnail',
        pithumbsize: '160',
        pilimit: '30',
        wbptterms: 'description',
        origin: '*',
    }).toString();
    const response: PreviewsResponse = await fetch(url.toString(), { credentials: 'omit', headers: wikiHeaders, signal })
        .then((r) => r.json())
        .catch((error) => {
            console.log(error);
        })
    var previews: WikiContentPreview[] = [];
    if (typeof response?.query?.pages === 'undefined') return { previews, response };
    for (const page of Object.values(response.query.pages) as WikiRawSuggestion[]) {
        if (page.missing != null) continue;
        previews.push({
            title: page?.title,
            description: page?.terms?.description[0],
            thumbnail: page?.thumbnail,
            id: page.pageid,
            wiki_lang
        });
    }
    return { previews, response };
}

export async function getSeededRandomPages(
    lang: string,
    date: Date,
    seed: string,
    numberOfPages: number,
    signal?: AbortSignal
) {

    const lastDate = new Date(date);
    lastDate.setUTCDate(lastDate.getUTCDate() - 1);
    const highestPageId = await getHighestPageId(lang, lastDate);

    const random = createSeededRandomGenerator(seed);

    const randomPageIds = Array.from({ length: numberOfPages }, () =>
        random(highestPageId)
    );
    const pages: { pageid: number, title: string }[] = [];

    findRandomPage: for (const pageId of randomPageIds) {
        const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
        const { generateBatch } = generateCloseNumbers(pageId, 0, highestPageId, 50);
        const MAX_BATCH_TRIES = 3;
        let tries = 0;
        while (true) {
            if (tries++ >= MAX_BATCH_TRIES) throw `Unable to find seeded Random in ${tries} batchs of 50 pages`;
            const page_ids_sequence = generateBatch();
            const params: Record<string, string> = {
                action: "query",
                format: "json",
                pageids: page_ids_sequence.join("|"),
                prop: "info",
                formatversion: "2",
                origin: "*"
            };

            Object.keys(params).forEach((key) => {
                url.searchParams.append(key, params[key]);
            });

            type ApiReturn = {
                batchcomplete: true,
                query: {
                    pages: WikiPageInfo[],
                }
            }
            const response = await fetch(url.toString(), { credentials: 'omit', headers: wikiHeaders, signal });
            const json: ApiReturn = await response.json();
            let page_id_to_page_info = json.query.pages.reduce((acc, p) => {
                acc[p.pageid] = p;
                return acc;
            }, {} as Record<number, WikiPageInfo>);

            for (const page_id of page_ids_sequence) {
                const page = page_id_to_page_info[page_id];
                if (!("missing" in page) && page.ns == 0 && page.redirect == null) {
                    pages.push({ pageid: page.pageid, title: page.title });
                    continue findRandomPage;
                }
            }
        }

        
    }
    console.log({
        lastDate,
        highestPageId,
        randomPageIds,
        pages,


    })
    return pages;
}

export async function getRandomPage(lang: LangCode, quantity:number = 1) {
    const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
    const params: Record<string, string> = {
        action: "query",
        format: "json",
        prop: 'pageprops|pageimages|pageterms',
        piprop: 'thumbnail',
        pithumbsize: '160',
        pilimit: '30',
        wbptterms: 'description',
        generator: "random",
        grnnamespace: "0",
        grnlimit: quantity.toString(),
        grnfilterredir: "nonredirects",
        origin: "*"

    };

    Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url.toString(), { credentials: 'omit', headers: wikiHeaders });
    const json = await response.json() as RandomResponse;


    return Object.values(json.query.pages).map(page=>({
        title: page?.title,
        description: page?.terms?.description[0],
        thumbnail: page?.thumbnail,
        id: page.pageid,
        wiki_lang: lang
    }));
}


export async function getHighestPageId(lang: string, date:Date): Promise<number> {
  const url = new URL(`https://${lang}.wikipedia.org/w/api.php`);
  const params: Record<string, string> = {
    action: "query",
    format: "json",
    list: "recentchanges",
    formatversion: "2",
    rcend: date.toISOString(),
    rcdir: "older",
    rcnamespace: "0",
    rcprop: "ids",
    rclimit: "1",
    rctype: "new",
    origin: "*"
  };

  Object.keys(params).forEach((key) => {
    url.searchParams.append(key, params[key]);
  });

  const response = await fetch(url.toString(), { credentials: 'omit', headers: wikiHeaders });
  const json = await response.json();
  const pageId = json.query.recentchanges[0].pageid;

  return pageId;
}


let abortSuggestions = new AbortController();
export async function loadSuggestions(input: string, wiki_lang: LangCode, n = 5):Promise<WikiContentPreview[]> {
    abortSuggestions.abort();
    abortSuggestions = new AbortController();
    const url = new URL(`https://${wiki_lang}.wikipedia.org/w/api.php`);
    url.search = new URLSearchParams({
        action: "query",
        format: "json",
        formatversion: "2",
        gpssearch: input,
        generator: "prefixsearch",
        prop: "description|pageimages|pageviews",
        redirects: "1",
        piprop: "thumbnail",
        pithumbsize: "160",
        pilimit: "30",
        gpslimit: n.toString(),
        origin: "*",
    }).toString();
    try {
        const response: WikiPreviewResponse = await fetch(url.toString(), { credentials: 'omit', headers: wikiHeaders, signal: abortSuggestions.signal })
            .then((r) => r.json())
        if (typeof response?.query?.pages === 'undefined') return [];
        return response.query.pages
            .sort((a, b) => a.index - b.index)
            .map(p => ({
                id: p.pageid,
                title: p.title,
                description: p.description,
                thumbnail: p.thumbnail,
                wiki_lang
            }));
    } catch (e) {
        return [];
    }
}

export async function* findWikiPreviewStream(input: AsyncIterable<string> | Iterable<string>, wiki_lang: LangCode, abort:AbortController) {
    const MAX_CONCURRENT = 5;
    // const limiter = new Bottleneck({maxConcurrent: MAX_CONCURRENT});

    const concurrentRequests:Promise<WikiPreviewResponse|null>[] = [];

    for await (const title of input) {
        const url = new URL(`https://${wiki_lang}.wikipedia.org/w/api.php`);
        url.search = new URLSearchParams({
            action: "query",
            format: "json",
            formatversion: "2",
            gpssearch: title,
            generator: "prefixsearch",
            prop: "description|pageimages|pageviews",
            redirects: "1",
            piprop: "thumbnail",
            pithumbsize: "160",
            pilimit: "30",
            gpslimit: "1",
            origin: "*",
        }).toString();
        try {
            concurrentRequests.push(
                fetch(url.toString(), { credentials: 'omit', headers: wikiHeaders, signal: abort.signal })
                    .then((r) => r.json() as Promise<WikiPreviewResponse>)
                    .catch(_=>null)
            );
            if (concurrentRequests.length<MAX_CONCURRENT) continue;
            const wrappedConcurrentRequests = concurrentRequests.map(p => p.then(_ => [p]));
            const [request] = await Promise.race(wrappedConcurrentRequests);
            const i = concurrentRequests.indexOf(request);
            if (i != -1) concurrentRequests.splice(i, 1);
            const response = await request;
            if (typeof response?.query?.pages === 'undefined') continue;
            const p = response.query.pages[0];
            yield {
                id: p.pageid,
                title: p.title,
                description: p.description,
                thumbnail: p.thumbnail,
                wiki_lang
            } as WikiContentPreview; 
        } catch (e) {
            
        }
    }

    while (concurrentRequests.length > 0) {
        const wrappedConcurrentRequests = concurrentRequests.map(p => p.then(_ => [p]));
        const [request] = await Promise.race(wrappedConcurrentRequests);
        const i = concurrentRequests.indexOf(request);
        if (i != -1) concurrentRequests.splice(i, 1);
        const response = await request;
        if (typeof response?.query?.pages === 'undefined') continue;
        const p = response.query.pages[0];
        yield {
            id: p.pageid,
            title: p.title,
            description: p.description,
            thumbnail: p.thumbnail,
            wiki_lang
        } as WikiContentPreview; 
    }
}

export interface WikiThumbnail {
    source: string,
    width: number,
    height: number
}

export interface WikiRawPreview {
    ns: number,
    pageid: number,
    index: number,
    title: string,
    description: string,
    thumbnail: WikiThumbnail,
    missing?: string
}


export interface WikiPreviewResponse {
    query: {
        pages: WikiRawPreview[]
    }
}


export type WikiRawSuggestion = {
    pageid: number,
    ns: number,
    index: number,
    title: string,
    terms: {
        description: string[]
    },
    thumbnail: WikiThumbnail,
    missing?: string
}

export interface WikiContentPreview {
    title: string,
    description?: string
    thumbnail?: WikiThumbnail,
    id: number,
    wiki_lang: LangCode
}

export const wikiHeaders = new Headers({
    "Api-User-Agent": "wiki-adventure/1.1 (https://wikiadeventu.re/; pro@sacramentix.fr)"
});

type PreviewsResponse = {
    query: {
        redirects: {
            from: string,
            to: string
        }[],
        normalized: {
            from: string,
            to: string
        }[],
        pages: any
    }
}

type RandomResponse = {
    query: {
        pages: Record<number,{
            pageid: number,
            ns: 0,
            index: number,
            title: string,
            terms: {
                description: string[]
            },
            thumbnail: WikiThumbnail,
        }>
    }
}


type WikiPageInfo = {
    pageid: number,
    ns: number,
    title: string,
    contentmodel: string,
    pagelanguage: string,
    pagelanguagehtmlcode: string,
    pagelanguagedir: string,
    touched: string,
    lastrevid: number,
    length: number,
    redirect?: true
} | {
    pageid: number,
    missing: true
}