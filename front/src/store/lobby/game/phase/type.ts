export type GamePhaseType = VanillaPhaseType | ModPhaseType;

export enum VanillaPhaseType {
    Waiting,
    Voting,
    Playing,
    RoundFinish,
    GameFinish
}

// Register your mod phase here and on the back.
export enum ModPhaseType {
    Default = 1000
}