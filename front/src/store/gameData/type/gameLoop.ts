export enum GameLoopType {
    Classic,
    Random,
}

export enum ModGameLoopType {
    Default = 1000,
}
export function importGameMode(g:number) {
    switch (g) {
        case GameLoopType.Classic: return import('pages/gameMode/Classic.vue');
        case GameLoopType.Random: return import('pages/gameMode/Random.vue');
        default: return import('pages/gameMode/Classic.vue');
    }
}
