export type WikiQuery = {
    searchinfo: {
        totalhits:number
    },
    search:WikiResult[],
    random:WikiResult[],
    pages:WikiResult[],
}
export type WikiResult = {
    ns:number,
    title:string,
    pageid:number,
    links:WikiResult[]
}

export type WikiResponse = {
    query:WikiQuery;
}