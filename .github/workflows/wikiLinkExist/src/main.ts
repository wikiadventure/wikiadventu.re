import * as queryString from "https://deno.land/x/querystring@v1.0.2/mod.js";
import * as C from "https://deno.land/std/fmt/colors.ts";
import { Lang } from "./lang.ts";

const { args } = Deno;

const dir = args[0] || "test";
var hasError = false;
const pagesChecksByLang = new Map<string,PagesCheck[]>();

console.log(C.white("Start validating link in the folder " + dir));
 
for await (const entry of Deno.readDir(dir)) {
    if (entry.isDirectory) continue;
    const lang = entry.name.substring(0,entry.name.indexOf("."));
    if (!Object.values(Lang).includes(lang as Lang)) {
        console.log(C.red("File ignored : "+entry.name+"\nDidn't match any lang"));
        continue;
    } 
    const text = await Deno.readTextFile(dir+"/"+entry.name);
    console.log(C.white("Start validating "+dir+"/"+entry.name));
    const array =  text.split("\r\n");
    for (const l of array) {
        if (l.startsWith("* ")) {
            const title = l.substring(2);
            add(lang,title);
        }
    }
}
for (const [lang, pagesChecks] of pagesChecksByLang.entries()) {
    for (const p of pagesChecks) {
        if (p.check == null) p.check = checkOnWiki(lang, p.pages);
        await p.check;
    }
}
console.log(hasError ? C.red("Process terminated with error.") : C.green("Process terminated without any error."));
Deno.exit(hasError ? 1 : 0);

function add(lang:string, title:string) {
    const pagesChecks = ( pagesChecksByLang.has(lang) ? pagesChecksByLang.get(lang)  : pagesChecksByLang.set(lang, [{pages:[]}]).get(lang) ) as PagesCheck[];
    const l = pagesChecks.length-1;
    const lastPagesChecks = pagesChecks[l];
    const a = lastPagesChecks.pages.length != 50 ? lastPagesChecks : pagesChecks[pagesChecks.push({pages:[]})-1];
    a.pages.push(title);
    if (a.pages.length == 50) {
        lastPagesChecks.check = checkOnWiki(lang,lastPagesChecks.pages);
    }
}

async function checkOnWiki(lang:string, a:string[]) {
    console.log("validate : "+a.length+" pages" );
    console.log(a);
    const json = await fetch(`https://${lang}.wikipedia.org/w/api.php`,{
        method: "POST",
        body: queryString.stringify({
            "action": "query",
            "format": "json",
            "titles": a.join("|")
        }),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }})
        .then(r=>r.json())
        .catch(e=>console.log(C.red('Error'),e));
    if (json.error) return console.error(C.red("Error during wiki query: ")+ C.yellow(json.error));

    Object.values(json.query.pages).forEach((e:any)=>{
        if (e.missing == "") {
            hasError = true;
            console.error(C.red("This title doesn't exist : ") + C.yellow(e.title));
            console.error(C.red("Lang : ") + C.yellow(lang));
        }
    })
}

type PagesCheck = {
    pages: string[],
    check?: Promise<void>
}

export {};
