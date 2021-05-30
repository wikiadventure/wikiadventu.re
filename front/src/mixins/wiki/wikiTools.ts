import { Lang } from "src/i18n";
import { WikiPreview, WikiRawSuggestion, WikiSuggestion } from "src/store/gameData/state";

export var wikiHeaders = new Headers({
    "Api-User-Agent": "wiki-adventure/1.1 (https://wiki-adventure.sacramentix.fr/; pro@sacramentix.fr)"
});

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
          description: page?.terms?.description[0] || null,
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
    const response = await fetch(url.toString(), { headers: wikiHeaders })
    .then((r) => r.json())
    .catch((error) => {
      console.log(error);
    })
    var previews:WikiPreview[] = [];
    if (typeof response?.query?.pages === 'undefined') return previews;
    for (const page of Object.values(response.query.pages) as WikiRawSuggestion[]) {
      previews.push({
        title: page.title,
        description: page?.terms?.description[0] || null,
        thumbnail: page?.thumbnail
      });
    }
    return previews;
}