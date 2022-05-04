export type WikiRequest = {
    action:string,
    list?:string,
    srlimit?:number,
    srnamespace?:number,
    srsearch?:string,
    srprop?:string
    rnnamespace?:number,
    rnlimit?:number,
    titles?:string
    redirects?:number,
    format?:string,
    formatversion?:string,
    generator?:string,
    gpltitles?:string
}
