
//@ts-ignore
export const enumValuesToArray = (...E: any[]) => [].concat(...E.map(x => Object.values(x).filter(k => typeof x[k as any] != "number")));