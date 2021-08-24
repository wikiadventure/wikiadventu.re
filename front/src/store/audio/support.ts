
const a = new Audio();
export const supportOGG = a.canPlayType("audio/ogg");
export const supportMP3 = a.canPlayType("audio/mpeg");

export function supportedType() {
    if (supportOGG == "probably") return "ogg";
    if (supportMP3 == "probably") return "mp3";
    if (supportOGG == "maybe") return "ogg";
    if (supportMP3 == "maybe") return "mp3";
    return "";

}