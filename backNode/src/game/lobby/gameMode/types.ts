export enum VanillaGameModType {
    Classic,
    Random
}

export enum ModGameModType {
    Default = 1000
}

export type GameModType = VanillaGameModType | ModGameModType;