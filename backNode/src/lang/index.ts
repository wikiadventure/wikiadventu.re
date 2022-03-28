export enum Lang {
    en = "en",//english
    fr = "fr",//french
    de = "de",//german
    es = "es",//spanish
    it = "it",//italian
    eo = "eo",//esperanto
    pt = "pt",//portugues
    el = "el",//Greek
    sv = "sv",//Swedish
}

export function getLangName(l:Lang) {
    switch (l) {
        case Lang.en: return "English";
        case Lang.fr: return "Français";
        case Lang.de: return "Deutsch";
        case Lang.es: return "Español";
        case Lang.it: return "italiano";
        case Lang.eo: return "Esperanto";
        case Lang.pt: return "Português";
        case Lang.el: return "Eλληνικά";
        case Lang.sv: return "Svenska";
        default: return "Unknown";
    }
}

export function getWikiUrl(l:Lang) {
    return l + ".wikipedia.org";
}
