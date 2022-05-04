import { FrPages } from './pages/Fr';
import { Lang } from './../../../lang/index';
import type { DailyDate, DailyPageType } from './types';
import { EnPages } from './pages/En';

const map = new Map<Lang, Map<DailyDate, DailyPageType>>([
    [Lang.fr, FrPages],
    [Lang.en, EnPages],
]);


export const currentPages = new Map<Lang, DailyPageType>();

export function setDailyCurrentPage() {
    const t = new Date();
    const z = (n:number, p:number) => String(n).padStart(p, '0');
    //format date 'dd/mm/yyyy'
    const date = `${z(t.getUTCDate(),2)}/${z(t.getUTCMonth(),2)}/${z(t.getUTCFullYear(),4)}`;
    for (const lang of map.keys()) {
        var c = map.get(lang)?.get(date);
        if (c != null) currentPages.set(lang, c);
    }
}