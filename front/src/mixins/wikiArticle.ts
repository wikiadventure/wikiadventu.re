import { Lang } from "src/i18n";
import { wikiHeaders } from "./wikiTools";

interface heading {
  title:string,
  children:Array<heading>,
}
interface wikiResponse {
  parse:{
    title:string,
    pageid:number,
    text:any
  }
}
export default class WikiArticle {
  pageURL:string;
  title:string;
  lang:Lang;
  doc?:Document;
  isMobile:boolean;
  constructor(pageURL:string, lang:Lang, isMobile = false) {
    this.pageURL = pageURL;
    this.lang = lang;
    this.title = "";
    this.isMobile = isMobile
  }

  get content() {
    return this.doc?.body.innerHTML;
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

  async fetch() {
    var url = new URL('https://'+this.lang+'.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: "parse",
      prop: "text",
      redirects: "1",
      format: "json",
      origin: "*",
      formatversion: "2",
      disableeditsection: "1",
      mobileformat: this.isMobile ? "1" : "0",
      page: this.pageURL
    }).toString();
    const response:wikiResponse = await fetch(url.toString(), { headers: wikiHeaders })
    .then(function(response){return response.json()});
    this.title = response.parse.title;
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