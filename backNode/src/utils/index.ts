//@ts-ignore
export const enumValuesToArray = (...E: any[]) => [].concat(...E.map(x => Object.values(x).filter(k => typeof x[k as any] != "number")));

declare global {
    interface Array<T> {
        remove(x:T): void;
        popRandom():T | undefined;
    }
}

Array.prototype.remove = function (x) {
    const i = this.indexOf(x);
    return i > -1 && this.splice(i,1);
}

Array.prototype.popRandom = function () {
    return this.splice(Math.floor(Math.random()*this.length), 1)[0];
}

export function sampleSize<T>(array:T[], n = 1):T[] {
    const length = array.length;
    if (!length || n < 1) return [];
    n = n > length ? length : n
    let index = -1
    const lastIndex = length - 1
    while (++index < n) {
      const rand = index + Math.floor(Math.random() * (lastIndex - index + 1))
      const value = array[rand]
      array[rand] = array[index]!
      array[index] = value!
    }
    return array.slice( 0, n);
  }