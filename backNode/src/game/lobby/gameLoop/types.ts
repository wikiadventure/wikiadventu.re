export enum VanillaGameLoopType {
    Classic,
    Random
}

export enum ModGameLoopType {
    Default = 1000
}

export type GameLoopType = VanillaGameLoopType | ModGameLoopType;