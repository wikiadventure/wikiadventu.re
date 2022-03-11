export interface WikiRawSuggestion  {
    ns: number, 
    index: number, 
    title: string, 
    terms: {
      description: string[]
    },
    thumbnail: {
      source: string,
      width: number,
      height: number
    }
    missing?: string
}

export const wikiHeaders = new Headers({
    "Api-User-Agent": "wiki-adventure/1.1 (https://wikiadeventu.re/; pro@sacramentix.fr)"
});