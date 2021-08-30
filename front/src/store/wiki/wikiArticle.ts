import { Lang } from "src/i18n";
import { wikiHeaders } from "./type";

interface heading {
  title:string,
  children:Array<heading>,
}
interface wikiResponse {
  parse:{
    title:string,
    pageid:number,
    text:any,
    links:link[]
  }
}

interface link {
  ns: number,
  exists: string,
  title: string
}
export default class WikiArticle {
  title= "";
  doc?:Document;
  links:link[] = [];
  isMobile = false;
  constructor() {

  }

  get headings() {
    const headings = new Array<heading>();
    this.doc!.querySelectorAll('h2, h3').forEach(e => {
      const heading:heading = {
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

  async fetch(title:string, lang:Lang, isMobile = false) {
    var url = new URL('https://'+lang+'.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: "parse",
      prop: "text|links",
      redirects: "1",
      format: "json",
      origin: "*",
      formatversion: "2",
      disableeditsection: "1",
      mobileformat: this.isMobile ? "1" : "0",
      page: title
    }).toString();
    const response:wikiResponse = await fetch(url.toString(), { headers: wikiHeaders })
    .then(r => r.json());
    this.isMobile = isMobile;
    this.title = response.parse.title;
    this.links = response.parse.links;
    this.formatHTML(response.parse.text);
    return this;
  }

  formatHTML(html:string) {
    this.doc = new DOMParser().parseFromString(html, 'text/html');
    const selectors = '.navbox, .ambox, .sistersitebox, .mw-empty-elt';
    const elementsToRemove = [...this.doc.querySelectorAll(selectors)];
    elementsToRemove.forEach(e => e.parentElement!.removeChild(e));
  }
}