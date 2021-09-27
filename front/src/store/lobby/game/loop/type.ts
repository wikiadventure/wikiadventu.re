export enum VanillaLoopType {
    Classic,
    Random,
}
// Register your mod loop here and on the back.
export enum ModLoopType {
    //Default = 1000,
}

export type GameLoopType = VanillaLoopType | ModLoopType;

export function gameLoopIcon(mode:GameLoopType) {
    switch (mode) {
        case VanillaLoopType.Classic: return "mdi-wikipedia";
        case VanillaLoopType.Random: return "mdi-dice-5";
        default: return "mdi-dice-5";
    }
}