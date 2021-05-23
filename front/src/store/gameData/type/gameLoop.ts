export enum GameLoopType {
    Classic,
    Random,
}

export enum ModGameLoopType {
    Default = 1000,
}

export function icon(mode:GameLoopType) {
    switch (mode) {
        case GameLoopType.Classic: return "mdi-wikipedia";
        case GameLoopType.Random: return "mdi-dice-5";
        default: return "mdi-dice-5";
    }
}