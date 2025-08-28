import type { LangCode } from "../../i18n/lang";


export const wikiHeaders = new Headers({
    "Api-User-Agent": "wiki-adventure/1.1 (https://wikiadventu.re/; pro@sacramentix.fr)"
});

interface heading {
    title: string,
    children: Array<heading>,
}
interface wikiResponse {
    parse: {
        title: string,
        pageid: number,
        text: any,
        links: link[],
        headhtml: string
    }
}

interface link {
    ns: number,
    exists: string,
    title: string
}
export default class WikiPageContent {
    parsedTitle = "";
    doc?: Document;
    head?: HTMLHeadElement | null;
    links: link[] = [];
    initialTitle = "";
    lang:LangCode = "en";
    isMobile = false;
    pageid = -1;
    constructor() {

    }

    get headings() {
        const headings = new Array<heading>();
        this.doc!.querySelectorAll('h2, h3').forEach(e => {
            const heading: heading = {
                title: e.innerHTML,
                children: [],
            }
            if (e.nodeName === 'H2') {
                headings.push(heading)
            } else {
                const parent = headings[headings.length - 1]
                if (parent) parent.children.push(heading)
                else headings.push(heading)
            }
        })
        return headings
    }

    async fetch(title: string, lang: LangCode, isMobile:boolean) {
        this.lang = lang;
        this.initialTitle = title;
        this.isMobile = isMobile;
        const url = new URL('https://' + lang + '.wikipedia.org/w/api.php');
        url.search = new URLSearchParams({
            mobileformat: "1",
            action: "parse",
            prop: "text|langlinks|links|externallinks|displaytitle|iwlinks|headhtml",
            useskin: isMobile ? "minerva" : "vector-2022",
            // apioutput cologneblue contenttranslation fallback minerva modern monobook timeless vector vector-2022
            redirects: "1",
            format: "json",
            origin: "*",
            disablestylededuplication: "1",
            formatversion: "2",
            disableeditsection: "1",
            page: title
        }).toString();
        const response: wikiResponse = await fetch(url.toString(), { credentials: 'omit', headers: wikiHeaders })
            .then(r => r.json());
        // this.isMobile = isMobile;
        this.parsedTitle = response.parse.title;
        this.links = response.parse.links;
        this.pageid = response.parse.pageid;
        this.formatHead(response.parse.headhtml, lang);
        this.formatHTML(response.parse.text);
        return this;
    }

    formatHTML(html: string) {
        this.doc = new DOMParser().parseFromString(html, 'text/html');
        const selectors = '.navbox, .navbar, .ambox, .sistersitebox, .mw-empty-elt, .lazy-image-placeholder, script';
        this.doc.querySelectorAll(selectors)
            .forEach(e => e.parentElement!.removeChild(e));
        this.doc.querySelectorAll("img")
            .forEach(e =>{
                e.setAttribute("crossorigin","anonymous");
                // map.wikimedia.org don't allow cross origin so we disable it
                if (e.src.startsWith("https://map.wikimedia.org/")) {
                    e.src =""
                }
            });
        this.doc.querySelectorAll("noscript")
            .forEach(e => {
                const temp = document.createElement('div');
                temp.innerHTML = e.innerHTML;
                //@ts-ignore
                temp.firstChild.setAttribute("loading", "lazy");
                e.parentElement?.appendChild(temp.firstChild!);
            })

    }

    formatHead(html: string, lang:LangCode) {
        const headDoc = new DOMParser().parseFromString(html, 'text/html');
        this.head = headDoc.querySelector("head");

        const hrefs = this.head?.querySelectorAll("link");
        hrefs?.forEach(e => e.href = e.href.replace(window.location.origin, `https://${lang}.wikipedia.org`));

        const scripts = this.head?.querySelectorAll("script");
        scripts?.forEach(e => e.src = e.src.replace(window.location.origin, `https://${lang}.wikipedia.org`));

    }
}
