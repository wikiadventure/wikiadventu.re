import { Lang } from "src/i18n";
import { WikiPreview, WikiSuggestion } from "../vote/type";
import { wikiHeaders, WikiRawSuggestion } from "./type";

export async function loadSuggestions(vote:string, lang:Lang, n = 5) {
    var url = new URL('https://'+lang+'.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      gpssearch: vote,
      generator: 'prefixsearch',
      prop: 'pageprops|pageimages|pageterms',
      redirects: '1', // Automatically resolve redirects
      ppprop: 'displaytitle',
      piprop: 'thumbnail',
      pithumbsize: '160',
      pilimit: '30',
      wbptterms: 'description',
      gpsnamespace: "0", // Only return results in Wikipedia's main namespace
      gpslimit: n.toString(), // Return at most five results
      origin: '*',
    }).toString();
    const response = await fetch(url.toString(), { headers: wikiHeaders })
    .then((r) => r.json())
    .catch((error) => {
      console.log(error);
    })
    var suggestions:WikiSuggestion[] = [];
    if (typeof response?.query?.pages === 'undefined') return suggestions;
    for (const page of Object.values(response.query.pages) as WikiRawSuggestion[]) {
      if ( page.ns === 0 ) {
        suggestions.push({
          index: page.index,
          title: page.title,
          description: page?.terms?.description[0],
          thumbnail: page?.thumbnail
        });
      }
    }
    suggestions.sort((a,b) => a.index-b.index);
    return suggestions;
}

export async function loadPreviews(titles:string[], lang:Lang) {
    var url = new URL('https://'+lang+'.wikipedia.org/w/api.php');
    url.search = new URLSearchParams({
      action: 'query',
      format: 'json',
      titles: titles.join("|"),
      prop: 'pageprops|pageimages|pageterms',
      redirects: '1', // Automatically resolve redirects
      piprop: 'thumbnail',
      pithumbsize: '160',
      pilimit: '30',
      wbptterms: 'description',
      origin: '*',
    }).toString();
    const response:PreviewsResponse = await fetch(url.toString(), { headers: wikiHeaders })
    .then((r) => r.json())
    .catch((error) => {
      console.log(error);
    })
    var previews:WikiPreview[] = [];
    if (typeof response?.query?.pages === 'undefined') return {previews, response};
    for (const page of Object.values(response.query.pages) as WikiRawSuggestion[]) {
      if (page.missing != null) continue;
      previews.push({
        title: page.title,
        description: page?.terms?.description[0],
        thumbnail: page?.thumbnail
      });
    }
    return {previews,response};
}

export async function loadRandom() {
  
}

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
    pages:any
  }
}