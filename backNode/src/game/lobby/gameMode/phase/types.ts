export enum VanillaPhaseType {
    Waiting,
    Voting,
    Playing,
    RoundFinish,
    GameFinish,
}

// Register your mod phase here and on the front.
export enum ModPhaseType {
    Default = 1000
}

export type PhaseType = VanillaPhaseType | ModPhaseType;
