export enum VanillaGamePhaseType {
    Waiting,
    Voting,
    Playing,
    RoundFinish,
    GameFinish,
}

// Register your mod phase here and on the front.
export enum ModGamePhaseType {
    Default = 1000
}

export type GamePhaseType = VanillaGamePhaseType | ModGamePhaseType;
